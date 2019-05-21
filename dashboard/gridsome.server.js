// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const COLLECTION_NAMES = [
  'authors', 'posts', 'tags', 'topics', 'users'
]

module.exports = function (api) {
  api.loadSource(store => {
    // Use the Data store API here: https://gridsome.org/docs/data-store-api

    const collections = store.addContentType({
      typeName: 'Collections',
      route: '/:collection*'
    })

    COLLECTION_NAMES.forEach(cName => {
      collections.addNode({ collection: cName })
    })
  })
}
