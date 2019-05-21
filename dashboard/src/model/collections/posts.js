import loadasync, { defs } from '~/model/loadasync'

loadasync('comments')
loadasync('authors')
loadasync('topics')
loadasync('tags')

const posts = {
  collection: 'posts',
  singular: 'post',
  plural: 'posts',
  title: 'Posts',
  icon: 'el-icon-document',
  actions: {
    canCreate: true,
    canDelete: true
  },
  subs: [{
    label: 'Comments',
    collection() {
      return defs.comments
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
      key: 'author',
      label: 'Author',
      type: 'reference',
      collection () {
        return defs.authors
      },
      reference: {
        key: 'fname',
        label: 'Full name',
        type: 'text'
      }
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
      },    },
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
      key: 'topic',
      label: 'Topic',
      type: 'reference',
      collection () {
        return defs.topics
      },
      reference: {
        key: 'name',
        label: 'Name',
        type: 'text'
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

export default posts
