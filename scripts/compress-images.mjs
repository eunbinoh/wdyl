import sharp from "sharp";
import { readdirSync, renameSync } from "fs";

const files = readdirSync("./public/items_img");
for (const file of files) {
  if (!file.endsWith(".jpg")) continue;
  const input = `./public/items_img/${file}`;
  const tmp = `./public/items_img/_tmp_${file}`;
  await sharp(input).resize(400).jpeg({ quality: 75 }).toFile(tmp);
  renameSync(tmp, input);
}
console.log("done");
