const Model = {
  createNew (fields) {
    const _doc = {}
    fields.forEach(f => {
      _doc[f.key] = Model._createField(f)
    })
    return _doc
  },
  fromData (fields, data) {
    if (!data) return Model.createNew(fields)
    const _doc = {}
    if (data.id) _doc.id = data.id
    if (data.__ref__) _doc.__ref__ = data.__ref__
    fields.forEach(f => {
      _doc[f.key] = Model._createField(f, data[f.key])
    })
    return _doc
  },
  _createField (field, value, type) {
    type = type || field.type
    switch (type) {
      case 'map': return Model._newMap(field, value)
      case 'object': return Model._newObject(field, value)
      case 'array': return Model._newArray(field, value)
      case 'boolean': return value !== undefined ? !!value : false
      case 'number': return typeof value === 'number' ? value * 1 : null
      case 'datetime': debugger; return value ? value.toDate ? value.toDate() : new Date(value) : null
      case 'geoPoint': return value ? new firebase.firestore.GeoPoint(value._lat, value._long) : new firebase.firestore.GeoPoint(59.41595945911929, 10.48245426199196)
      case 'reference': return value || ''
      default:
        if (field.extends) return Model._createField(field, value, field.extends)
        return value && value.toString ? value.toString() : ''
    }
  },
  _newMap (field, value) {
    const _map = {}
    if (!!value && typeof value === 'object') {
      Object.keys(value).forEach(k => {
        _map[k] = Model._createField(field.map.value, value[k])
      })
    }

    return _map
  },
  _newObject (field, value) {
    const _obj = {}
    if (!!value && typeof value === 'object') {
      field.object.forEach(f => {
        _obj[f.key] = Model._createField(f, value[f.key])
      })
    } else {
      field.object.forEach(f => {
        _obj[f.key] = Model._createField(f)
      })
    }
    return _obj
  },
  _newArray (field, value) {
    const _arr = []
    if (Array.isArray(value)) {
      if (field.arrayType) {
        const at = { type: field.arrayType }
        value.forEach((v, i) => {
          _arr[i] = Model._createField(at, v)
        })
      } else {
        value.forEach((v, i) => {
          _arr[i] = Model._createField(field.array, v)
        })
      }
    }

    _arr.add = () => {
      if (field.arrayType) _arr.push(Model._createField({ type: field.arrayType }))
      else _arr.push(Model._createField(field.array))
    }

    return _arr
  }
}

export default Model
