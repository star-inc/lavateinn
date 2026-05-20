// Lavateinn - Tiny and flexible microservice framework.
// SPDX-License-Identifier: BSD-3-Clause (https://ncurl.xyz/s/mI23sevHR)

export interface HonoEnv {
    Variables: {
        instance: {
            id: string;
            url: string;
            role: string;
            context: Map<string, unknown>;
        };
    };
}
