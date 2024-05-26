// Import process
import {
    tmpdir,
} from "node:os";
import {
    join as pathJoin,
} from "node:path";
import {
    mkdirSync,
} from "node:fs";

import {
    rimrafSync,
} from "rimraf";

const tempPathPrefix = tmpdir();
const tempPathMap = {};

export const useTemp = (name) => {
    const path = pathJoin(tempPathPrefix, name);
    const cleanup = () => {
        delete tempPathMap[name];
        rimrafSync(path);
    };
    mkdirSync(path, {
        recursive: true,
    });
    tempPathMap[name] = path;
    return {path, cleanup};
};

// Handle exit signals
export const exitHandler = () => {
    Object.values(tempPathMap).forEach((path) => {
        rimrafSync(path);
    });
};
