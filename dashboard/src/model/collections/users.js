import loadasync, { defs } from '~/model/loadasync'
import { objectDisplay } from '~/model/formatters'

const users = {
  collection: 'users',
  singular: 'user',
  plural: 'users',
  title: 'Users',
  icon: 'el-icon-user',
  actions: {
    canCreate: false,
    canDelete: true
  },
  fields: [
    {
      key: 'image',
      label: 'Avatar',
      type: 'image',
      isPrivate: true,
      width: 70
    },
    {
      key: '__key__',
      label: 'ID',
      type: 'hidden',
      readonly: true
    },
    {
      key: 'email',
      label: 'Epost',
      type: 'email',
      rules: [
        { type: 'email', required: true }
      ]
    },
    {
      key: 'fullname',
      label: 'Full name',
      type: 'text',
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Full name is required'
        },
        {
          pattern: /^(([a-zåøæàáâäãåąčćęèéêëėįìíîïłńòóôöõùúûüųūÿýżźñçčšž-]){2,}((\ ([a-zåøæàáâäãåąčćęèéêëėįìíîïłńòóôöõùúûüųūÿýżźñçčšž-]){2,})+))$/i,
          message: 'Invalid Name (John Doe)'
        }
      ]
    },
    {
      key: 'roles',
      label: 'Roles',
      type: 'object',
      title (field, obj) {
        if (obj && obj.superadmin) return 'Superadmin'
        if (obj && obj.admin) return 'Admin'
        return '–––'
      },
      display: objectDisplay,
      object: [
        {
          key: 'superadmin',
          label: 'Superadmin',
          type: 'boolean'
        },
        {
          key: 'admin',
          label: 'Admin',
          type: 'boolean'
        }
      ]
    }
  ]
}

export default users
