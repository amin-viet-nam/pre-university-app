module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    "plugins": [
      ["import", { "libraryName": "antd-mobile", "style": "css" }] // `style: true` for less
    ]
  };
};
