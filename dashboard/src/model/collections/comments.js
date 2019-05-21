import loadasync, { defs } from '~/model/loadasync'

loadasync('posts')

const comments = {
  collection: 'posts/__key__/comments',
  url: 'comments',
  parent: {
    label: 'Post',
    url: 'posts'
  },
  singular: 'comment',
  plural: 'comments',
  title: 'Comments',
  icon: 'el-icon-s-comment',
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
      key: 'fname',
      label: 'Full name',
      type: 'text',
      readonly: true,
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Name is required'
        },
        {
          pattern: /^(([a-zA-Z\s\-]){2,50})$/i,
          message: 'Invalid Name'
        }
      ]
    },
    {
      key: 'comment',
      label: 'Comment',
      type: 'textarea',
      readonly: true,
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Name is required'
        },
        {
          length: 180,
          message: 'Can not be more than 180 chars'
        }
      ]
    },
    {
      key: 'created',
      label: 'Created',
      type: 'datetime',
      readonly: true
    },
  ]
}

export default comments
