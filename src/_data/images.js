import fs from "fs"
import path from "path"

export default () => {
        const imageFolder = "./src/assets/images/japanImages";
        return fs
.readdirSync(imageFolder)
.filter((file) => file != ".stfolder")
.map((file) => {
        const filePath = path.join(imageFolder, file);
        const stats = fs.statSync(filePath);
        return { file, time : stats.mtime}
                })
.sort((a,b) => a.time - b.time)
.map(({file}) => `/assets/images/japanImages/${file}`);
};


