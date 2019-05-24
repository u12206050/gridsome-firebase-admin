// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const path = require('path')

function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
	      path.resolve(__dirname, './src/assets/sass/*.scss'),
      ],
    })
}

module.exports = {
  siteName: 'Gridsome Admin',
  plugins: [],
  chainWebpack (config, { isServer }) {
    if (isServer) {
      config.externals([/^(vue|vue-router)$/])
    }

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .use('vue-svg-loader')
      .loader('vue-svg-loader')

    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('scss').oneOf(type)))
  }
}
