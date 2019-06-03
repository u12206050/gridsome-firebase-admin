<template>
  <div class="CollectionTable">
    <el-row type="flex" style="align-items: center; padding: 10px; background: #fff;" justify="space-between">
      <el-col :span="12" :xs="16">
        <el-select style="width: 30%; max-width: 100px" v-model="filterField" placeholder="Select Field" v-if="fields[filterField]" @change="onSortSearch">
          <el-option v-for="(field, index) in fields" :key="index" :label="field.label" :value="index"></el-option>
        </el-select>

        <el-input placeholder="Search" v-model="search" @input="onSearch" style="display: inline-block; width: 50%; margin-left: 10px"/>

        <el-button class="sort-switch" type="text" circle v-bind:class="{ toggle: sortAsc > 0 }" :title="sortAsc > 0 ? 'Sort Descending' : 'Sort Ascending'" icon="el-icon-sort" @click="sortAsc *= -1, onSortSearch()"></el-button>

        <el-button v-if="parent"><router-link :to="`/${parent.url}?id=${parentId}`">⇡ {{parent.label}}</router-link></el-button>
      </el-col>
      <el-col :span="6" style="text-align: center;" class="hidden-sm-and-down">
        <div class="grid-content" v-show="selectedDocs.length">{{selected}} selected</div>
      </el-col>
      <el-col :span="6" :xs="8" style="text-align: right;">
        <el-dropdown v-if="customActions && customActions.length" @command="doAction">
          <span class="el-dropdown-link">
            Actions<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(action, aIndex) in customActions" :key="aIndex" :command="action"><i class="material-icons" v-if="action.mIcon">{{action.mIcon}}</i>{{action.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button icon="el-icon-delete" circle @click="deleteSelected" v-if="selectedDocs.length && actions.canDelete"></el-button>
        <el-button icon="el-icon-plus" circle @click="addNew" v-if="actions.canCreate && isSuper"></el-button>
      </el-col>
    </el-row>

    <el-table ref="elTable" :data="page" @selection-change="onSelect" @row-dblclick="onRow" v-loading="!!loading" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="50"></el-table-column>
      <template v-for="(field, fIndex) in fields">
        <el-table-column :key="fIndex + field.key" :width="field.width" :label="field.label" :prop="field.key" v-if="field.type !== 'hidden'">
          <template slot-scope="scope">
            <i v-if="typeof scope.row[field.key] === 'undefined'" class="el-icon-minus"></i>
            <TableCell v-else :field="field" :cell="scope.row[field.key]" />
          </template>
        </el-table-column>
      </template>

      <template v-for="(sub, sIndex) in subs">
        <el-table-column :key="sIndex" :label="sub.label">
          <template slot-scope="scope">
            <router-link :to="`/${collection}/${scope.row.__key__}/${sub.collection().url}`">⇢</router-link>
          </template>
        </el-table-column>
      </template>

      <el-table-column fixed="right" label="Operations" width="120" v-if="actions.canEdit !== false && isSuper">
        <template slot-scope="scope">
          <el-button size="mini" @click="editDoc(scope.$index, scope.row)">
            <i class="el-icon-edit-outline"></i>
            <span style="margin-left: 10px" class="hidden-sm-and-down">Edit</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-row type="flex" style="align-items: center; padding: 10px; background: #fff;" justify="space-between">
      <el-col :span="8" style="text-align: left;">
        <div class="grid-content" v-show="selectedDocs.length">{{selected}} selected</div>
        <div class="grid-content" v-if="selectedDocs.length === 1">{{selectedDocs[0].__key__}}</div>
      </el-col>
      <el-col :span="8" style="text-align: center;">
        <div v-if="maxPages > 1">
          <el-button icon="el-icon-arrow-left" type="text" @click="pageTable(-1)" :disabled="currentPage == 1"></el-button>
          <span><sup>{{currentPage}}</sup>/<sub>{{maxPages}}</sub></span>
          <el-button icon="el-icon-arrow-right" type="text" @click="pageTable(1)" :disabled="currentPage == maxPages"></el-button>
        </div>
      </el-col>
      <el-col :span="8" style="text-align: right;">
        <el-dropdown v-if="customActions && customActions.length" @command="doAction">
          <span class="el-dropdown-link">
            Actions<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(action, aIndex) in customActions" :key="aIndex" :command="action">{{action.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button icon="el-icon-delete" circle @click="deleteSelected" v-if="selectedDocs.length && actions.canDelete"></el-button>
        <el-button icon="el-icon-plus" circle @click="addNew" v-if="actions.canCreate && isSuper"></el-button>
      </el-col>
    </el-row>

    <el-dialog v-if="form" :title="form.type + ' ' + singular" :visible.sync="form.visible" class="document-form-dialog" @close="form = null">
      <DynamicForm :fields="fields" :model="form.doc" :type="form.type" @onConfirm="setDoc" />
    </el-dialog>
  </div>
</template>

<script>
import Table from './bases/Table'
import TableCell from '~/components/TableCell'
import DynamicForm from '~/components/DynamicForm'

let unsubscribe = null

export default {
  extends: Table,
  name: 'CollectionTable',
  components: {DynamicForm, TableCell},
  props: {
    collection: { type: String, required: true },
    singular: { type: String, required: true },
    plural: { type: String, required: true },
    title: { type: String, required: true },
    query: { type: Array },
    subs: { type: Array },
    parent: { type: Object },
    parentId: { type: String },
    fields: {
      type: Array,
      required: true,
      validator: function (array) {
        return !array.find(o => typeof o !== 'object')
      }
    },
    actions: { type: Object, required: true },
    customActions: { type: Array }
  },
  data () {
    return {
      resolvedData: {},
      loading: 0,
      form: null,
      confirmDelete: false
    }
  },
  computed: {
    collectionPath () {
      return this.$store.collectionPath(this.collection, this.parentId)
    },
    urlId () {
      return this.$route.query.id
    },
    isSuper () {
      return true || this.$auth.roles['superadmin']
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.__key__ === this.urlId) return 'highlight'
      return '';
    },
    reset () {
      this.search = ''
      this.filterField = 0
      this.selectedDocs = this.page = this.filtered = this.documents = []
      this.$refs.elTable.clearSelection()
      this.currentPage = 0
      if (unsubscribe) unsubscribe()
      let ref = this.$db.collection(this.collectionPath)
      if (this.query) this.query.forEach(q => {
        ref = ref.where(q.key, q.operator, q.value)
      })
      unsubscribe = ref.onSnapshot((querySnap) => {
        this.documents = querySnap.docs.map(doc => {
          let data = doc.data()
          data.__key__ = doc.id
          data.__ref__ = doc.ref

          return data
        })
        this.filtered = this.documents
        this.maxPages = Math.ceil(this.filtered.length / this.itemsPerPage)
        this.onSortSearch()
      }, (err) => this.$notify({ type: 'warning', message: this.collectionPath + ': ' + err.message }))
    },
    addNew () {
      this.form = {
        doc: {},
        type: 'Create',
        visible: true
      }
    },
    editDoc (index, item) {
      this.form = {
        doc: item,
        type: 'Update',
        visible: true
      }
    },
    updateRelation (docData, field, relation, docRef, fieldValue, promises, K) {
      /* Gets a value from the given relation document, to update a proprery on the current document */
      if (relation.get) {
        let promise = docRef.get().then(snap => {
          if (snap.exists) {
            let doc = snap.data()

            let relValue
            if (!relation.get.type || ['text', 'number', 'boolean'].includes(relation.get.type)) {
              relValue = doc[relation.get.key]
            } else {
              // TODO recursivly get value
              console.warn('NOT IMPLEMENTED YET')
            }

            if (typeof relValue !== 'undefined') {
              /* Just set value */
              if (relation.get.value === '_value_') {
                fieldValue[K] = relValue
                this.$notify({ type: 'success', message: `Updated value of ${field.key} [${K}] to ${relValue}` })
              } else if (relation.get.value === '_key_') {
                fieldValue[relValue] = fieldValue[K]
                this.$notify({ type: 'success', message: `Added a new key ${relValue} to ${field.key}` })
              }
            }
          }
          return true
        })
        promises.push(promise)
      }
      /* Updates a property of the relation document with a value from the current document */
      if (relation.set) {
        try {
          let relKey = relation.set.key
          let relValue

          switch (relation.set.value) {
            case '__ref__':
              if (!docData.__ref__) throw new Error(`No reference object found for ${docData.__key__}`)
              relValue = docData.__ref__
              break
            case '_key_': relValue = K
              break
            case '_value_': relValue = fieldValue[K]
              break
            default: {
              relValue = docData[relation.set.value]
            }
          }

          let colTitle = typeof relation.collection === 'function' ? relation.collection().title : this.collectionPath
          let promise
          if (relation.set.type === 'array') {
            promise = docRef.get().then(snap => {
              if (snap.exists) {
                let arrValue = snap.data()[relKey]
                if (!Array.isArray(arrValue)) arrValue = []
                arrValue.push(relValue)
                return docRef.update({[relKey]: arrValue})
              } return false
            })
          } else {
            promise = docRef.update({[relKey]: relValue})
          }

          promise.then((updated) => {
            if (!updated) return false
            this.$notify({ type: 'success', message: `Updated relation value of ${relKey} to ${relValue.id ? relValue.id : relValue} on ${colTitle}` })
            return true
          })

          promises.push(promise)

        } catch (error) {
          this.$notify({ type: 'warning', message: error.message })
        }
      }
    },
    checkRelations (docData) {
      const promises = []
      this.fields.forEach(field => {
        if (field.relations) {
          field.relations.forEach(relation => {
            let fieldValue = docData[field.key]
            if (!fieldValue) return
            let collection = typeof relation.collection === 'function' ? relation.collection().collection : relation.collection
            let colRef = this.$db.collection(collection)

            if (['object','map'].includes(field.type)) {
              if (!relation.map && !relation.object) throw new Error('Need to know key/value')
              let I = relation.map || relation.object
              let keys = Object.keys(fieldValue)
              keys.forEach(K => {
                let docRef = fieldValue[K]
                if (I === 'key')
                  docRef = colRef.doc(K)
                else if (typeof docRef === 'string') docRef = colRef.doc(fieldValue[K])

                this.updateRelation(docData, field, relation, docRef, fieldValue, promises, K)
              })
            } else {
              let docRef = fieldValue
              if (typeof docRef === 'string') docRef = colRef.doc(fieldValue[K])

              this.updateRelation(docData, field, relation, docRef, fieldValue, promises)
            }
          })
        }
      })
      return Promise.all(promises)
    },
    setDoc (docData) {
      let key = docData.__key__
      let request = null

      this.checkRelations(docData).then(() => {
        delete docData.__key__
        delete docData.__ref__

        const collection = this.$db.collection(this.collectionPath)
        if (this.form.type === 'Create') {
          request = key ? collection.doc(key).set(docData) : collection.add(docData)
        } else if (key) {
          request = collection.doc(key).update(docData)
        }

        if (request) {
          request.then((res) => {
            this.$message({ type: 'success', message: this.form.type + ' ' + this.singular + ' succeeded' })
            this.form = null
          }).catch(error => {
            this.$notify({ type: 'error', message: error.message })
          })
        } else {
          this.$notify({ type: 'warning', message: 'Could not save or insert new ' + this.singular })
        }
      })
    },
    deleteSelected () {
      this.$confirm('Delete ' + this.selected + '?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        let onSuccess = () => {
          this.loading--
          this.$message({ type: 'success', message: 'Deleted' })
        }
        let onCatch = (error) => {
          this.loading--
          console.warn(error)
          this.$message({ type: 'error', message: 'Failed to delete' })
        }
        this.selectedDocs.forEach((doc) => {
          this.loading++
          doc.__ref__.delete().then(onSuccess).catch(onCatch)
        })
      })
    },
    doAction (action) {
      this.$emit(action.event, {
        action: action,
        selected: this.selectedDocs
      })
    },
    onRow (row) {
      this.$emit('onDoc', row)
    }
  },
  watch: {
    '$route' () {
      this.reset()
    }
  },
  mounted () {
    this.reset()
  },
  beforeDestroy () {
    if (unsubscribe) unsubscribe()
  }
}
</script>

<style lang="scss">
.el-table {
  width: 100%;

  tr.highlight {
    background-color: #eff;
  }

  .cell {
    word-break: keep-all
  }
}
</style>
