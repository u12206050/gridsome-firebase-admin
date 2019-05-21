// @flow

import Vue from 'vue'
import { firebase, db, auth } from '@/fire'

const store = Vue.observable({
  user: null,
  posts: null,
  authors: null,
  teams: null,
  topics: null,
  comments: null,
  gallery: {visible: false},
  scope: {}
})

store.collectionPath = (path, parentId) => {
  if (!path) throw new Error('Did you remember to declare collection on model definition')
  if (typeof path === 'function') path = path().collection
  else if (typeof collection === 'object') path = path.collection
  if (path.indexOf('/__key__/') > 0) {
    const parts = path.split('/')
    if (parts.length === 3 && parentId) {
      parts[1] = parentId
      path = parts.join('/')
    } else {
      let parent = null
      path = []
      parts.forEach(part => {
        if (part === '__key__') {
          if (!store.scope.hasOwnProperty(parent)) throw new Error(`Scope does not currently have ${parent}`)
          path.push(store.scope[parent])
          parent = store.scope[parent]
        } else {
          path.push(part)
          parent = part
        }
      })
      path = path.join('/')
    }
  }
  return path
}

Vue.prototype.$store = store

export default store