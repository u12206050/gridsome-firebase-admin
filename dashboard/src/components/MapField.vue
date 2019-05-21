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
          <DynamicField v-model="val.key" :doc="doc" @input="onChange" :parent="field" :field="field.key" :disabled="disabled" :invalid="invalid" />
        </td>
        <td>
          <DynamicField v-model="val.value" :doc="doc" @input="onChange" :parent="field" :field="field.value" :disabled="disabled" :invalid="invalid" />
        </td>
        <td>
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
  }
</style>

<script>
import Model from '~/model'

export default {
  name: 'MapField',
  props: {
    field: { type: Object, required: true },
    value: { required: true },
    disabled: { type: Boolean },
    invalid: { type: Boolean },
    doc: { type: Object }
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
        return map
      },
      set(newValue) {
        this.onChange()
      }
    }
  },
  methods: {
    onChange (change) {
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
        this.$emit("input", map)
      } catch (error) {
        this.$message({ type: 'error', message: error.message })
      }
    },
    addRow () {
      this.syncValue.push({ key: '', value: Model._createField(this.field.value) })
      this.$forceUpdate()
    },
    removeRow (index) {
      this.syncValue.splice(index, 1)
      this.onChange(true)
    }
  }
}
</script>
