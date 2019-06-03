import loadasync, { defs } from '~/model/loadasync'

const categories = {
  collection: 'categories',
  url: 'categories',
  singular: 'Category',
  plural: 'categories',
  title: 'Categories',
  icon: 'el-icon-guide',
  actions: {
    canCreate: true,
    canDelete: true
  },
  fields: [
    {
      key: '__key__',
      label: 'ID',
      type: 'hidden',
      readonly: true
    },
    {
      key: 'name',
      label: 'Category name',
      type: 'text',
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Name is required'
        }
      ]
    },
    {
      key: 'act',
      label: 'Active',
      type: 'boolean'
    },
    {
      key: 'menu',
      label: 'Show in Menu',
      type: 'boolean'
    },
    {
      key: 'info',
      label: 'Info',
      type: 'textarea',
    },
    {
      key: 'image',
      label: 'Cover Image',
      type: 'image',
      width: 70
    },
    {
      key: 'parent',
      label: 'Parent Category',
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
  ]
}

export default categories
