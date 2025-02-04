import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import clean from "eleventy-plugin-clean";
import { statSync } from "fs";
import { execSync } from "child_process";

export default (config) => {
    
    config.addPlugin(EleventyHtmlBasePlugin);
    config.addPlugin(clean);

    config.addPassthroughCopy("src/style");
    config.addPassthroughCopy("src/sketches");
    config.addPassthroughCopy("src/mathjax-init.js");
    config.addPassthroughCopy("src/assets");
    config.addPassthroughCopy("src/immanant-matching-refactor")

    const markdownLibrary = markdownIt({ html: true }).use(markdownItAnchor, {
        permalink: false,
        slugify: s => s.toLowerCase().replace(/[^\w]+/g, '-')
    });

    config.addFilter("lastModified", (filePath) => {
        const stats = statSync(filePath);
        return stats.mtime;
    });

    config.addFilter("gitLastModified", (filePath) => {
        try {
            return execSync(`git log -1 --format=%cI ${filePath}`).toString().trim();
        } catch (error) {
            return null; // Handle files that may not be tracked by Git
        }
    });


    config.setLibrary("md", markdownLibrary);


    return { 
        pathPrefix: "/",
        dir : {
            input: "src",
            out: "_site"
        }
    }
}
