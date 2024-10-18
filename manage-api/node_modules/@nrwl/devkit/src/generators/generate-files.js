"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFiles = void 0;
const fs = require("fs");
const path_1 = require("path");
const ejs = require('ejs');
/**
 * Generates a folder of files based on provided templates.
 *
 * While doing so it performs two substitutions:
 * - Substitutes segments of file names surrounded by __
 * - Uses ejs to substitute values in templates
 *
 * @param host - the file system tree
 * @param srcFolder - the source folder of files (absolute path)
 * @param target - the target folder (relative to the host root)
 * @param substitutions - an object of key-value pairs
 *
 * Examples:
 *
 * ```typescript
 * generateFiles(host, path.join(__dirname , 'files'), './tools/scripts', {tmpl: '', name: 'myscript'})
 * ```
 *
 * This command will take all the files from the `files` directory next to the place where the command is invoked from.
 * It will replace all `__tmpl__` with '' and all `__name__` with 'myscript' in the file names, and will replace all
 * `<%= name %>` with `myscript` in the files themselves.
 *
 * `tmpl: ''` is a common pattern. With it you can name files like this: `index.ts__tmpl__`, so your editor
 * doesn't get confused about incorrect TypeScript files.
 */
function generateFiles(host, srcFolder, target, substitutions) {
    allFilesInDir(srcFolder).forEach((filePath) => {
        const computedPath = computePath(srcFolder, target, filePath, substitutions);
        const template = fs.readFileSync(filePath).toString();
        const newContent = ejs.render(template, substitutions);
        host.write(computedPath, newContent);
    });
}
exports.generateFiles = generateFiles;
function computePath(srcFolder, target, filePath, substitutions) {
    const relativeFromSrcFolder = path_1.relative(srcFolder, filePath);
    let computedPath = path_1.join(target, relativeFromSrcFolder);
    if (computedPath.endsWith('.template')) {
        computedPath = computedPath.substring(0, computedPath.length - 9);
    }
    Object.entries(substitutions).forEach(([propertyName, value]) => {
        computedPath = computedPath.split(`__${propertyName}__`).join(value);
    });
    return computedPath;
}
function allFilesInDir(parent) {
    let res = [];
    try {
        fs.readdirSync(parent).forEach((c) => {
            const child = path_1.join(parent, c);
            try {
                const s = fs.statSync(child);
                if (!s.isDirectory()) {
                    res.push(child);
                }
                else if (s.isDirectory()) {
                    res = [...res, ...allFilesInDir(child)];
                }
            }
            catch (e) { }
        });
    }
    catch (e) { }
    return res;
}
//# sourceMappingURL=generate-files.js.map