import loadasync, { defs } from '~/model/loadasync'

loadasync('reviews')
loadasync('attributes')
loadasync('categories')
loadasync('tags')

const visibleOptions = {
  0: 'Nowhere',
  1: 'Directly',
  2: 'Catalog',
  3: 'Search',
  4: 'Catalog & Search'
}

const products = {
  collection: 'products',
  singular: 'product',
  plural: 'products',
  title: 'Products',
  icon: 'el-icon-table-lamp',
  actions: {
    canCreate: true,
    canDelete: true
  },
  subs: [{
    label: 'Reviews',
    collection() {
      return defs.reviews
    }
  }],
  fields: [
    {
      key: 'sku',
      label: 'Sku',
      type: 'text',
      width: 120,
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Sku is required'
        }
      ]
    },
    {
      key: '__key__',
      label: 'ID',
      type: 'hidden',
      readonly: true
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      width: 120,
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Name is required'
        }
      ]
    },
    {
      key: 'img',
      label: 'Featured Image',
      type: 'image',
      width: 70
    },
    {
      key: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      width: 120,
    },
    {
      key: 'body',
      label: 'Content',
      type: 'tiptap',
      title: (field, val) => {
        return `HTML ${val.length}`
      },
      width: 120,
    },
    {
      key: 'act',
      label: 'Active',
      type: 'boolean'
    },
    {
      key: 'vis',
      label: 'Visible',
      type: 'select',
      default: 0,
      title: (field, val) => {
        return visibleOptions[val]
      },
      options: (() => Object.keys(visibleOptions).map(k => ({
        value: k,
        label: visibleOptions[k]
      })))()
    },
    {
      key: 'gall',
      label: 'Gallery',
      type: 'array',
      array: {
        key: '__index__',
        label: 'Image',
        type: 'image',
        width: 70
      },
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'array',
      width: 100,
      title: (field, arr) => {
        return arr.length
      },
      display: (field, arr) => {
        return arr.map(t => t.name).join(', ')
      },
      array: {
        key: '__index__',
        label: 'Tag',
        type: 'reference',
        collection () {
          return defs.tags
        },
        reference: {
          key: 'name',
          label: 'Name',
          type: 'text'
        }
      }
    },
    {
      key: 'cats',
      label: 'Categories',
      type: 'array',
      width: 100,
      array: {
        key: '__index__',
        label: 'Category',
        type: 'reference',
        collection () {
          return defs.categories
        },
        reference: {
          key: 'name',
          label: 'Name',
          type: 'text'
        }
      }
    },
    {
      key: 'attrs',
      label: 'Attributes',
      type: 'attributes',
      extends: 'map',
      width: 100,
      title (field, obj) {
        return Object.keys(obj).length
      },
      display (field, obj) {
        const o = Object.keys(obj).map(id => {
          return obj[id]
        })
        return o.join('<br>')
      },
      map: {
        heading: {
          key: 'Attribute',
          value: 'Value'
        },
        key: {
          key: '__index__',
          type: 'reference',
          collection () {
            return defs.attributes
          },
          reference: {
            key: 'name',
            label: 'Name',
            type: 'text'
          }
        },
        value (doc) {
          if (!doc) return {
            key: '__index__',
            label: '',
            type: ''
          }

          const { label, type } = doc
          return {
            key: '__index__',
            label,
            type
          }
        }
      }
    },
  ]
}

export default products
