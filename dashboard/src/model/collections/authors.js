import loadasync, { defs } from '~/model/loadasync'
import { objectDisplay } from '~/model/formatters'

const authors = {
  collection: 'authors',
  singular: 'author',
  plural: 'authors',
  title: 'Authors',
  icon: 'el-icon-user-solid',
  mdIcon: 'people',
  actions: {
    canCreate: true,
    canDelete: true
  },
  fields: [
    {
      key: 'image',
      label: 'Avatar',
      type: 'image',
      width: 70
    },
    {
      key: '__key__',
      label: 'ID',
      type: 'hidden',
      readonly: true
    },
    {
      key: 'fname',
      label: 'Full name',
      type: 'text',
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Full name is required'
        }
      ]
    }
  ]
}

export default authors
