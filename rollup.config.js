import typescript from "rollup-plugin-typescript";

export default {
    input: "assets/src/2019-01-27-mapping-shapes-to-spheres/uv-sphere-wireframe.ts",
    external: ["three"],
    output: {
        file: "assets/src/2019-01-27-mapping-shapes-to-spheres/uv-sphere-wireframe.js",
        format: "esm",
        paths: {
            three: "https://unpkg.com/three@0.103.0/build/three.module.js",
        },
    },
    plugins: [
        typescript(),
    ],
};
