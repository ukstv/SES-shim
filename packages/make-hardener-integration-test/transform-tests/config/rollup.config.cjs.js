import replace from "rollup-plugin-replace";

export default [
  {
    input: "../test/test.js",
    output: {
      file: "transform-tests/output/test.cjs.js",
      format: "cjs"
    },
    external: ["@agoric/make-hardener", "tape"],
    plugins: [
      replace({
        delimiters: ["", ""],
        "import makeHardener from '../src/index';":
          "import makeHardener from '@agoric/make-hardener';"
      })
    ]
  }
];
