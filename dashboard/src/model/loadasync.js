export const defs = {}

/**
 * Solves cicular dependancies by lazy loading collections.
 *
 * @param {string} def : The name of the collection to load in async
 */
export default (def) => {
  if (!defs.hasOwnProperty(def)) {
    defs[def] = false
    setTimeout(() => {
      import(/* webpackChunkName: "view-[request]" */ `~/model/collections/${def}`).then(loaded => {
        defs[def] = loaded.default
      })
    })
  }
}
