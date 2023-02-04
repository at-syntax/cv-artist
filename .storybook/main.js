const path = require("path");

module.exports = {
  stories: [
    path.join(process.cwd(), "./src/**/*.stories.mdx"),
    path.join(process.cwd(), "./src/**/*.stories.@(js|jsx|ts|tsx)"),
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
};
