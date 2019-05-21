import loadasync, { defs } from '~/model/loadasync'

const tags = {
  collection: 'tags',
  url: 'tags',
  singular: 'tag',
  plural: 'tags',
  title: 'Tags',
  icon: 'el-icon-collection-tag',
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
      label: 'Tag name',
      type: 'text',
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Name is required'
        }
      ]
    }
  ]
}

export default tags
