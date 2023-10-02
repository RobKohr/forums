import { knex } from "../db";
import * as $ from cheerio;
const assetUrlBase = "https://godotengine.org/asset-library/asset/";
console.log(assetUrlBase);
interface Asset {
  id: string;
  data: string;
}


const maxId = 1



async function insertAsset(asset: Asset) {
  const result = await knex("assets").insert(asset);
  console.log(result);
  return result;
}

const asset = {
  id: "some-id",
  data: JSON.stringify({
    name: "some-name",
    description: "some-description",
  }),
};
insertAsset(asset);
