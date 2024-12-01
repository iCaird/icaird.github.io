import { readdirSync } from "fs";
import { } from 'path';

const galleryFolder = "./src/assets/images/japanImages";

export default () => {
  console.log(readdirSync(galleryFolder));
   return readdirSync(galleryFolder).filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file));
}
  
