import loadasync, { defs } from '~/model/loadasync'

const typeOptions = {
  number: 'Number',
  string: 'Text',
  boolean: 'True/False',
  date: 'Date'
}
const attributes = {
  collection: 'attributes',
  url: 'attributes',
  singular: 'Attribute',
  plural: 'attributes',
  title: 'Attributes',
  icon: 'el-icon-connection',
  actions: {
    canCreate: true,
    canDelete: true
  },
  fields: [
    {
      key: '__key__',
      label: 'ID',
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
      key: 'name',
      label: 'Name',
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
      key: 'type',
      label: 'Type',
      type: 'select',
      title: (field, val) => {
        return typeOptions[val]
      },
      options: (() => Object.keys(typeOptions).map(key => {
        return {
          value: key,
          label: typeOptions[key]
        }
      }))()
    }
  ]
}

export default attributes
