"use strict";

// Routers
export const routerFiles = [
    "./example.mjs",
];

// Load routes
export const load = () => {
    const routerMappers = routerFiles.map((n) => import(n));
    routerMappers.forEach((c) => c.then((f) => f.default()));
};
