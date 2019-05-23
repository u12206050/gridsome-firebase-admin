<template>
  <el-form v-if="doc" v-loading="busy" :model="doc" :rules="rules" ref="docForm" class="dynamicForm" @submit.native.prevent="validateForm">
    <DynamicField v-for="(field, fIndex) in fields" :doc="doc" :key="fIndex" v-model="doc[field.key]" :field="field" :disabled="busy || !!(type === 'Create' && field.relations)" :isInvalid="errors[field.key]" />
    <hr/>
    <div style="text-align: right">
      <el-popover v-if="doc.__key__" placement="bottom" style="float: left" :title="doc.__key__" width="300" trigger="click">
        <el-button slot="reference">View ID</el-button>
      </el-popover>
      <el-button type="submit" :loading="busy" @click="confirm">{{type === 'Create' ? 'Create' : 'Save'}}</el-button>
    </div>
  </el-form>
</template>

<script>
import DynamicField from '~/components/DynamicField'
import Schema from 'async-validator'
import Model from '~/model'
import isEqual from 'lodash.isequal'

export default {
  name: 'DynamicForm',
  components: { DynamicField },
  props: {
    fields: { required: true, type: Array },
    model: { required: true, type: Object },
    type: { type: String }
  },
  data () {
    return {
      doc: null,
      busy: false,
      errors: {}
    }
  },
  watch: {
    model () {
      this.buildModel()
    }
  },
  mounted () {
    this.buildModel()
  },
  computed: {
    rules () {
      const rules = {}
      this.fields.forEach(field => {
        if (Array.isArray(field.rules)) rules[field.key] = field.rules
      })
      return rules
    },
    isSuper () {
      return true || this.$auth.roles['superadmin']
    }
  },
  methods: {
    buildModel () {
      this.doc = Model.fromData(this.fields, this.model)
    },
    validateForm() {
      if (this.isValid()) {
        let data = {
          __key__: this.doc.__key__,
          __ref__: this.doc.__ref__
        }
        let old = Model.fromData(this.fields, this.model)
        this.fields.forEach(field => {
          if (field.type === 'boolean' && typeof this.doc[field.key] === 'undefined') this.doc[field.key] = false
          if (this.doc[field.key] !== undefined && !isEqual(old[field.key], this.doc[field.key]) && (!field.readonly || (this.isSuper && confirm(`${field.label} is a readonly field. Are you sure you want to update it?`)))) {
            data[field.key] = this.doc[field.key]
          }
        })
        this.$emit('onConfirm', data);
      } else {
        this.$forceUpdate()
      }
      this.busy = false;
    },
    isValid(rules) {
      let isValid = true
      this.errors = {}
      this.fields.forEach(field => {
        if (Array.isArray(field.rules)) {
          let validator = new Schema({[field.key]: field.rules})
          validator.validate(this.doc, (errors, fields) => {
            if(errors && errors.length) {
              isValid = false
              errors.forEach(err => {
                this.errors[err.field] = err.message
              })
            }
          })
        } else if (typeof field.rules === 'function') {
          let errors = field.rules(this.doc)
          if(errors && errors.length) {
            isValid = false
            errors.forEach(err => {
              this.errors[err.field] = err.message
            })
          }
        }
      })
      return isValid
    },
    isFieldInvalid(fieldKey) {
      const field = this.doc[fieldKey]

      return field && field.$invalid && field.$dirty
    },
    confirm() {
      this.busy = true
      setTimeout(() => {
        this.validateForm()
      }, 100)
    }
  }
}
</script>

<style lang="scss">
.document-form-dialog .el-dialog {
  width: 900px;

  .el-dialog__body {
    max-height: 75vh;
    overflow-y: scroll;
  }
}
</style>
