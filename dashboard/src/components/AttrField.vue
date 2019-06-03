<template>
  <table class="map">
    <thead>
      <tr>
        <th>{{field.heading.key}}</th>
        <th>{{field.heading.value}}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(val, index) in syncValue" :key="index">
        <td>
          <TableCell v-if="editing !== val" :field="field.key" :cell="val.key" />
          <ReferenceInput v-else :field="field.key" @selected="(d) => { val.doc = d; $forceUpdate() }" v-model="val.key" :disabled="disabled" :invalid="invalid" />
        </td>
        <td>
          <TableCell v-if="editing !== val" :field="field.value()" :cell="val.value" />
          <i v-else-if="!val.doc" class="el-icon-loading"></i>
          <DynamicField v-else v-model="editing.value" @input="(v) => { editing.value = v }" :doc="doc" :parent="field" :field="field.value(val.doc)" :disabled="disabled" :invalid="invalid" />
        </td>
        <td>
          <el-button v-if="editing !== val" size="mini" type="primary" icon="el-icon-edit" @click="edit(val)" />
          <el-button v-else size="mini" type="primary" icon="el-icon-check" @click="save" />
          <el-button @click.prevent="removeRow(index)" type="text" icon="el-icon-close"></el-button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <el-button type="text" icon="el-icon-plus" @click.prevent="addRow" :disabled="disabled">Add {{field.label}}</el-button>
    </tfoot>
  </table>
</template>

<style lang="scss">
  table.map {
    width: 100%;

    th:first-child {
      width: 40%;
    }

    td {
      text-align: center;
    }
  }
</style>

<script>
import Model from '~/model'
import TableCell from '~/components/TableCell'

export default {
  name: 'AttrField',
  props: {
    field: { type: Object, required: true },
    value: { required: true },
    disabled: { type: Boolean },
    invalid: { type: Boolean },
    doc: { type: Object }
  },
  components: {
    ReferenceInput: (() => import('~/components/ReferenceInput')),
    TableCell
  },
  data () {
    return {
      editing: null
    }
  },
  computed: {
    syncValue: {
      get() {
        let map = []
        if (this.value && typeof this.value === 'object') {
          Object.keys(this.value).forEach(key => {
            map.push({
              key: key,
              value: this.value[key]
            })
          })
        }
        console.log(this.doc, map)
        return map
      },
      set(newValue) {
        this.onChange()
      }
    }
  },
  methods: {
    onChange (change) {
      console.log(this.syncValue)
      if (typeof change === 'undefined') return
      try {
        let map = {}
        if (Array.isArray(this.syncValue)) {
          this.syncValue.forEach(row => {
            if (row.key) {
              if (!map.hasOwnProperty(row.key)) {
                if (this.field.key.type === 'reference' && typeof row.key === 'object') {
                  map[row.key.id + ''] = row.value
                } else map[row.key + ''] = row.value
              } else {
                throw new Error('Can\'t have two of the same properties')
              }
            }
          })
        }
        console.log(map)
        this.$emit("input", map)
      } catch (error) {
        this.$message({ type: 'error', message: error.message })
      }
    },
    addRow () {
      this.editing = { key: '', value: Model._createField(this.field.value) }
      this.syncValue.push(this.editing)
      this.$forceUpdate()
    },
    removeRow (index) {
      this.syncValue.splice(index, 1)
      this.onChange(true)
    },
    save () {
      this.editing = null
      this.onChange(true)
    },
    edit(val) {
      this.editing = val
    }
  }
}
</script>
