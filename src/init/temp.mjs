// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Temporary files and directories management

// Import modules
import {tmpdir} from "node:os";
import {join as pathJoin} from "node:path";

import {mkdirSync} from "node:fs";
import {rimrafSync} from "rimraf";

const tempPathPrefix = tmpdir();
const tempPathMap = {};

/**
 * Create a temporary file or directory.
 * @module src/init/temp
 * @param {string} name - The name of the temporary file or directory.
 * @returns {object} The temporary file or directory.
 */
export function useTemp(name) {
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
}

/**
 * The exit handler to clean up temporary files and directories.
 * @returns {void}
 */
export function exitHandler() {
    Object.values(tempPathMap).forEach((path) => {
        rimrafSync(path);
    });
}
