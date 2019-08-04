### Each collection is defined in its' own file eg. users.js ###


# COLLECTION_MODEL #


***collection**: string

***singular**: string

***plural**: string

***title**: string

**subs**: array *(optional)*

**actions**: object<permission: boolean>

***fields**: array<FIELD>



# NOTE DOCUMENT #

***__key__**: ID of document

**__ref__**: DocumentReference of document



# FIELD #


A typical field has the following properties:

***key**: string

***type**: enum(text, email, number, boolean, textarea, array, map, object, reference)

**label**: string *(optional)*

**hint**: string *(optional)*

**title**: function(field, val)  (optional)

**display**: function(field, val)  *(optional)*

**readonly**: boolean

**rules**: array *(optional)*



The ***type*** property further defines what other properties the field should/can contain:


### FIELD[type=(text | email | number | textarea)] ###

**prefix**: string *(optional)*

**suffix**: string *(optional)*


### FIELD[type=select] ###

***options**: array<object<value: string, label: string>>

**multiple**: boolean *(optional)*

**autocomplete**: boolean *(optional)*


### FIELD[type=(text | email | textarea)] ###

**minlength**: integer *(optional)*

**maxlength**: integer *(optional)*


### FIELD[type=number] ###

**min**: integer *(optional)*

**max**: integer *(optional)*



### FIELD[type=array] ###

***arraytype**: enum(text, email, number, boolean)

***OR***

***array**: FIELD (*key of field should be '__index__'*)



### FIELD[type=object] ###

Use to group properties belonging together eg. Address contains: street, city and country 

***object**: array<FIELD>


### FIELD[type=geoPoint] ###

***object**: array<FIELD{lat, long}>

// Locations.js

export default {
  ...
  fields: [
    ...
    {
      key: 'geo',
      label: 'Geo Location',
      type: 'geoPoint',
      title: (field, geo) => {
        if (typeof geo === 'undefined' || isNaN(geo._lat) || isNaN(geo._long)) return '––––'

        return `${(geo._lat + '').substr(0, 9)}° N ${(geo._long + '').substr(0, 9)}° E`
      },
      object: [
        {
          key: '_lat',
          label: 'LAT',
          type: 'text'
        },
        {
          key: '_long',
          label: 'LNG',
          type: 'text'
        }
      ]
    }
    ...
  ]
}



### FIELD[type=map] ###

***map**: MAP

***MAP***

**heading**: object<key: string, value: string>

**key**: FIELD

**value**: FIELD



Example

```
#!javascript

// Family.js
loadasync('people')

export default {
  ...
  fields: [
    ...
    {
      key: 'children',
      label: 'Children',
      type: 'map',      
      title: objectTitle,
      display: objectDisplay,
      map: {
        heading: {
          key: 'Child',
          value: 'Age'
        },
        key: {
          key: '__index__',
          type: 'reference',
          collection () {
            return defs.people
          },
          reference: {
            key: 'name',
            label: 'Navn',
            type: 'text'
          }
        },
        value: {
          key: '__index__',
          label: 'Age'
          type: 'number',
        }
      }
    }
    ...
  ]
}
```


### FIELD[type=reference] ###

Reference another collection and use *prop* to define what value should be displayed

***collection**: COLLECTION_MODEL (The field on the collection to display)

***reference**: FIELD (The field on the collection to display)

**relation**: object<key: string, value: (string | function)

**prop**: string (Default is the *__name__*)


Example


```
#!javascript

// Car.js
loadasync('users')

export default {
  ...
  fields: [
    ...
    {
      key: 'user',
      label: 'Owner',
      type: 'reference',
      collection () {
        return defs.users
      },
      reference: {
        key: 'name',
        label: 'Name',
        type: 'text'
      }
    }
    ...
  ]
}
```




COLLECTION_MODEL Example:


```
#!javascript


export default {
  collection: 'users',
  singular: 'user',
  plural: 'users',
  title: 'Users',
  subs: [assets],
  actions: {
    canCreate: false,
    canDelete: false,
    canEdit: true
  },
  fields: [
    {
      key: 'fullname',
      label: 'Navn og Etternavn',
      type: 'text'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      key: 'age',
      label: 'Age',
      type: 'number'
    },
    {
      key: 'attributes',
      label: 'Attributes',
      type: 'map',
      title: (field, obj) {
        if (!obj) return 'none'
        return Object.keys(obj).length
      },
      display: (field, obj) {
        if (!obj) return 'none'
        let o = ''
        let oK = Object.keys(obj)
        oK.forEach(k => {
          o += k + ': ' + obj[k] + '<br/>'
        })
        return o
      },
      map: {
        heading: {
          key: 'Role',
          value: 'Active'
        },
        key: {
          key: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { value: 'admin', label: 'Admin', description: 'Manage Users & Full CRUD' },
            { value: 'manager', label: 'Editor', description: 'Full CRUD' },
            { value: 'explorer', label: 'Explorer', description: 'View Only' }
          ]
        },
        value: {
          key: 'active',
          label: 'Is Active',
          type: 'boolean'
        }
      }
    }
  ]
}
```
