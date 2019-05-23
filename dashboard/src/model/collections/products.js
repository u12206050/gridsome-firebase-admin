import loadasync, { defs } from '~/model/loadasync'

loadasync('reviews')
loadasync('attributes')
loadasync('categories')
loadasync('tags')

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
      key: '__key__',
      label: 'ID',
      type: 'hidden',
      readonly: true
    },
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
      key: 'title',
      label: 'Title',
      type: 'text',
      width: 120,
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Title is required'
        }
      ]
    },
    {
      key: 'image',
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
      key: 'status',
      label: 'Status',
      type: 'select',
      title: (field, val) => {
        switch (val*1) {
          case 0: return 'Draft'
          case 1: return 'Published'
        }
      },
      options: [
        { value: '0', label: 'Draft' },
        { value: '1', label: 'Published' }
      ]
    },
    {
      key: 'gallery',
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
      key: 'categories',
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
      key: 'attributes',
      label: 'Attributes',
      type: 'map',
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
        value: {
          key: '__index__',
          label: '',
          type: 'text'
        }
      }
    },
    {
      key: 'created',
      label: 'Created',
      type: 'datetime',
      readonly: true
    },
  ]
}

export default products
