<template>
  <el-select v-if="!disabled" v-model="syncValue" v-loading="!docs" :filterable="true" :multiple="field.multiple" :placeholder="field.reference.label" :invalid="invalid">
    <el-option v-for="(item, iIndex) in docs" :key="iIndex" :label="item.label" :value="item.value"></el-option>
  </el-select>
  <TableCell v-else :field="field" :cell="asDoc(syncValue)" />
</template>

<style lang="scss">

</style>

<script>

const unsubs = []
export default {
  name: 'ReferenceInput',
  props: {
    field: {type: Object, required: true},
    value: {required: false},
    disabled: {type: Boolean},
    invalid: {type: Boolean}
  },
  data () {
    return {
      docs: null,
      unsub: null
    }
  },
  computed: {
    syncValue: {
      get() {
        if (!this.value) return null
        // Is already DocumentReference Object
        if (typeof this.value === 'object') return this.value.path
        // value is path
        if (this.value.indexOf('/') > 0) return this.value
        // value is ID, Need to build DocumentReference first
        return this.$db.collection(this.collectionPath).doc(this.value).path
      },
      set(newValue) {
        this.$emit("input", newValue ? this.$db.doc(newValue) : null)
      }
    },
    filter () {
      return this.field.reference.key
    },
    collectionPath () {
      return this.$store.collectionPath(this.field.collection)
    }
  },
  methods: {
    loadRefField (field, obj, par) {
      return new Promise((resolve, reject) => {
        if (typeof obj[field.key] !== 'undefined' && field.type === 'reference' && !obj[field.key].hasOwnProperty('__data')) {
          let ref = obj[field.key]
          if (typeof ref === 'string') ref = this.$db.collection(this.$store.collectionPath(field.collection)).doc(ref)
          if (!ref.get) throw new Error(field.key + ': Is not a valid reference object')
          ref.get()
            .then(doc => {
              let data = doc.data()
              data.__key__ = doc.id
              data.__ref__ = doc.ref
              resolve(this.loadRefField(field.reference, data, par || obj))
            })
            .catch(err => this.$message({ type: 'error', message: `Invalid ${ref.path} Reference Field` }));
        } else {
          resolve(typeof obj[field.key] === 'undefined' ? (par || obj).__key__.substring(0, 6) + '???' : String(obj[field.key]))
        }
      })
    },
    loadDocs () {
      if (!this.disabled) {
        this.unsub = this.$db.collection(this.collectionPath).onSnapshot((querySnap) => {
          this.docs = []
          Promise.all(querySnap.docs.map(doc => {
            let data = doc.data()
            data.__key__ = doc.id
            data.__ref__ = doc.ref

            return this.loadRefField(this.field.reference, data).then(label => {
              return { value: doc.ref.path, label: label }
            })
          })).then(result => {
            this.docs = result
            this.docs.splice(0, 0, { value: '', label: 'Ingen' })
          })
        }, (err) => this.$notify({ type: 'warning', message: this.collectionPath + ': ' + err.message }))
      }
    },
    asDoc (path) {
      return path ? this.$db.doc(path) : null
    }
  },
  mounted () {
    this.loadDocs()
  },
  beforeDestroy () {
    if (this.unsub) this.unsub()
  }
}
</script>


