import { knex } from "../db";

const assetUrlBase = "https://godotengine.org/asset-library/asset/";
console.log(assetUrlBase);
interface Asset {
  id: string;
  data: string;
}




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
