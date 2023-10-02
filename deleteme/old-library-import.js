const config = require("../config");
require("../server/mongo").connect((db) => {
  const { importAssetFromUrl } = require("../server/api/git.router");
  const rp = require("request-promise");
  const $ = require("cheerio");
  const maxId = 487;
  let cur = 0;
  function doFetch() {
    cur++;
    console.log("doing next fetch " + cur);
    if (cur > maxId) {
      console.log("exiting" + cur);
      process.exit();
    }

    const url = "https://godotengine.org/asset-library/asset/" + cur;
    console.log("starting");
    rp(url)
      .then(function (html) {
        console.log("fetched");
        const asset = {
          importDetails: {
            _id: "gdi" + cur,
            title: $("title", html)
              .text()
              .replace(" - Godot Asset Library", ""),
            shortDescription: $($(".media-body p", html)[1]).text().trim(),
            media: [],
            source: $(".btn-default", html)["0"].attribs.href,
            download: $(".btn-primary", html)["0"].attribs.href,
            assetLibraryImport: true,
            assetLibraryTag: $(".label-primary", html).text().trim(),
            assetLibraryVersion: $(".label-danger", html).text().trim(),
            lastUpdated: $(".text-muted", html)
              .html()
              .split("</a>")
              .slice(-1)[0]
              .replace(";", "")
              .trim(),
            icon: $(".media-object", html)["0"].attribs.src,
            version: $("small", html).text().trim(),
          },
        };
        const mapping = {
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
        asset.tags = mapping[asset.importDetails.assetLibraryTag];
        importAssetFromUrl(asset.importDetails.source, asset)
          .then((asset) => {
            console.log({ SUCCESS: asset });
            setTimeout(doFetch, 10);
          })
          .catch((message) => {
            console.error({ FAIL: message });
            doFetch();
          });
      })
      .catch(function (err) {
        setTimeout(function () {
          console.log("triggering next fetch");
          doFetch();
        }, 0);

        console.log({ err });
        //throw (err);
        //handle error
      });
  }
  doFetch();
});
