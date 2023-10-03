import axios from 'axios';
import $ from "cheerio";
import fs from "fs";
import { knex } from "../db";
const assetUrlBase = "https://godotengine.org/asset-library/asset/";
const maxId = 2217;
let cur = 1;


interface Asset {
  id: string;
  data: string;
}
async function insertAsset(asset: Asset) {
  console.log('inserting ', asset.id)
  try {
    const result = await knex("assets").insert(asset);
    return result;
  } catch (e) {
    console.log('error inserting ', asset.id, e)
  }
  fs.writeFileSync(`./data/gdi-export/${asset.id}.json`, JSON.stringify(JSON.parse(asset.data), null, 2));
}

function doFetch() {
  axios.get(assetUrlBase + cur).then((response) => {
    const html = response.data;
    const getText = (query: string, index?: number | undefined): string => {
      return getEl(query, index).text().trim();
    }
    const getEl = (query: string, index?: number | undefined): any => {
      if (index !== undefined) {
        return $($(query, html)[index]);
      } else {
        return $(query, html)
      }
    }
    if (!html.includes('btn-default')) {
      console.error('no html for ', cur);
      cur++;
      if (cur < maxId) {
        doFetch();
      }
      return
    }
    const userUrl = "https://godotengine.org/" + ($(".text-muted a", html)["0"].attribs.href);
    const username = userUrl.split("=")[1];
    const importDetails = {
      title: getText("title").replace(" - Godot Asset Library", ""),
      shortDescription: getText(".media-body p", 1),
      media: [],
      source: $(".btn-default", html)["0"].attribs.href,
      download: $(".btn-primary", html)["0"].attribs.href,
      isAssetLibraryImport: true,
      assetLibraryTag: $(".label-primary", html).text().trim() || '',
      godotVersion: $(".label-info", html).text().trim(),
      assetVersion: $(".label-danger", html).text().trim(),
      lastUpdated: $(".text-muted", html)
        ?.html()
        ?.split("</a>")
        .slice(-1)[0]
        .split('\n')
        .slice(-1)[0]
        .replace(";", "")
        .trim(),
      username: username,
      userUrl: userUrl,
      icon: $(".media-object", html)["0"].attribs.src,
      version: $("small", html).text().trim(),
      originalUrl: assetUrlBase + cur,
    }
    const im = importDetails;

    const tags: string[] = [];
    const data = {
      importDetails,
      name: im.title,
      description: im.shortDescription,
      source: im.source,
      download: im.download,
      isAssetLibraryImport: im.isAssetLibraryImport,
      godotVersion: im.godotVersion,
      assetVersion: im.assetVersion,
      lastUpdated: im.lastUpdated,
      username: `imported-from-godot-asset-library`,
      foreignUsername: im.username,
      foreignUserUrl: im.userUrl,
      icon: im.icon,
      version: im.version,
      originalUrl: im.originalUrl,
      tags,
    }
    interface Mapping {
      [key: string]: string[]
    }

    const mapping: Mapping = {
      "2D Tools": ["tools", "2d"],
      "3D Tools": ["tools", "3d"],
      Shaders: ["3d", "shaders"],
      Materials: ["3d", "materials"],
      Tools: ["tools"],
      Scripts: ["scripts"],
      Misc: ["uncategorized"],
      Templates: ["starting-points", "templates"],
      Projects: ["starting-points", "projects"],
      Demos: ["starting-points", "demos"],
    };
    data.tags = mapping[data.importDetails.assetLibraryTag];
    if (!data.tags) {
      console.log('No tags found for ', cur, data.importDetails.assetLibraryTag);
    }

    const asset = {
      id: "gdi-" + cur,
      data: JSON.stringify(data),
    }
    insertAsset(asset);
    cur++;
    if (cur < maxId) {
      doFetch();
    }
  });
}
doFetch();

///insertAsset(asset);
