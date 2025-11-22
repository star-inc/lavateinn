// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

// Temporary files and directories management

// Import modules
import {tmpdir} from "node:os";
import {join as pathJoin} from "node:path";

import {mkdirSync} from "node:fs";
import {rimrafSync} from "rimraf";

const tempPathPrefix = tmpdir();
const tempPathMap: Record<string, string> = {};

/**
 * Create a temporary file or directory.
 * @param name - The name of the temporary file or directory.
 * @returns The temporary file or directory.
 */
export function useTemp(name: string): { path: string; cleanup: () => void } {
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
 */
export function exitHandler(): void {
    Object.values(tempPathMap).forEach((path: string) => {
        rimrafSync(path);
    });
}
