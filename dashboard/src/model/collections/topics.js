import loadasync, { defs } from '~/model/loadasync'

const topics = {
  collection: 'topics',
  url: 'topics',
  singular: 'topic',
  plural: 'topics',
  title: 'Topics',
  icon: 'el-icon-collection',
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
      label: 'Topic name',
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
      key: 'info',
      label: 'Info',
      type: 'textarea',
    },
    {
      key: 'image',
      label: 'Cover Image',
      type: 'image',
      width: 70
    }
  ]
}

export default topics
