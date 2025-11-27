const path = require("path");
module.exports = function override(config, env) {
  //do stuff with the webpack config...

  // Aliases for source paths
  config.resolve.alias = {
    ...config.resolve.alias,
    "@": path.resolve(__dirname, "src"),
    "@constants": path.resolve(__dirname, "src/constants"),
    "@components": path.resolve(__dirname, "src/components"),
    "@endpoints": path.resolve(__dirname, "src/endpoints"),
    "@pages": path.resolve(__dirname, "src/pages"),
    "@utils": path.resolve(__dirname, "src/utils"),
    "@assets": path.resolve(__dirname, "assets"),
    "@types": path.resolve(__dirname, "types"),
  };

  return config;
};
