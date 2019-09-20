<template>
  <el-popover class="DynamicField" v-if="field.type != 'hidden' && (!field.visible || field.visible(field, doc))" trigger="hover" :content="field.hint" placement="right" :disabled="!field.hint">
    <div slot="reference">
      <el-form-item :label="field.label || label" :class="field.type" :rules="field.rules">
        <el-input v-if="['text', 'email', 'number', 'password', 'textarea', 'phone'].includes(field.type)" :type="field.type" :label="field.label" :id="id" v-model="syncValue" :disabled="isDisabled" :invalid="isInvalid"
          :min="field.min !== undefined ? field.min * 1 : undefined" :max="field.max !== undefined ? field.max * 1 : undefined"
          :minlength="field.minlength	 !== undefined ? field.minlength	 * 1 : undefined" :maxlength="field.maxlength !== undefined ? field.maxlength * 1 : undefined"
          >
          <template slot="prepend" v-if="field.prefix">{{field.prefix}}</template>
          <template slot="append" v-if="field.suffix">{{field.suffix}}</template>
        </el-input>

        <TipTap v-else-if="field.type == 'tiptap'" :doc="doc" v-model="syncValue" :disabled="isDisabled" />

        <ImageField v-else-if="field.type == 'image'" :doc="doc" v-model="syncValue" :private="field.isPrivate" :disabled="isDisabled"/>

        <TimestampInput v-else-if="['date', 'datetime'].includes(field.type)" :doc="doc" v-model="syncValue" :type="field.type" :placeholder="field.label" :disabled="isDisabled" :invalid="isInvalid" />

        <ReferenceInput v-else-if="field.type == 'reference'" :doc="doc" :field="field" v-model="syncValue" :disabled="isDisabled" :invalid="isInvalid" />

        <MapField v-else-if="field.type == 'map'" :doc="doc" :field="field.map" v-model="syncValue" :disabled="isDisabled" :invalid="isInvalid" />

        <AttributeField v-else-if="field.type == 'attributes'" :doc="doc" :field="field.map" v-model="syncValue" :disabled="isDisabled" :invalid="isInvalid" />

        <el-time-select v-else-if="field.type == 'time'" v-model="syncValue" :picker-options="{start: '08:30', step: '00:15', end: '18:30'}" :placeholder="field.label" :disabled="isDisabled" :invalid="isInvalid"></el-time-select>

        <el-switch v-else-if="field.type == 'boolean'" v-model="syncValue" :disabled="isDisabled"></el-switch>

        <el-select v-else-if="field.type == 'select'" v-model="syncValue" :filterable="field.autocomplete" :multiple="field.multiple" :placeholder="field.label" :disabled="isDisabled" :invalid="isInvalid">
          <el-option v-for="(item, iIndex) in field.options" :key="iIndex" :label="item.label" :value="item.value"></el-option>
        </el-select>

        <el-select v-else-if="field.type == 'arrayselect'" v-model="syncValue" :filterable="field.autocomplete" :multiple="field.multiple" :placeholder="field.label" :disabled="isDisabled" :invalid="isInvalid">
          <el-option v-for="(item, iIndex) in field.options" :key="iIndex" :label="item" :value="item"></el-option>
        </el-select>

        <el-autocomplete v-else-if="field.type == 'autocomplete'" :placeholder="field.label" :id="id" v-model="syncValue" :disabled="isDisabled" :fetch-suggestions="querySearch"></el-autocomplete>

        <span v-else-if="field.type == 'array'" class="arrayfields">
          <el-form-item v-for="(val, index) in syncValue" :key="index" :rules="{required: true, message: field.label + ' can not be null', trigger: 'blur'}">
            <DynamicField v-model="syncValue[index]" :doc="doc" :parent="field" :label="index + 1 + ':'" :field="field.array || {key: index, type: field.arrayType}" :disabled="isDisabled" :isInvalid="isInvalid" />

            <el-button @click.prevent="syncValue.splice(index,1)" type="text" icon="el-icon-close" class="remove-field"></el-button>
          </el-form-item>
          <el-button type="text" icon="el-icon-plus" @click.prevent="syncValue.add" :disabled="isDisabled">Add {{field.array ? field.array.label || field.label : field.label}}</el-button>
        </span>

        <div v-else-if="field.type == 'object'" class="objectfields">
          <DynamicField v-for="subField in field.object" :doc="doc" :parent="field" :key="subField.key" v-model="syncValue[subField.key]" :field="subField" :disabled="isDisabled" :isInvalid="isInvalid" />
        </div>

        <span v-else-if="field.type == 'geoPoint'">
          <p>{{field.title(field, syncValue)}}</p>
          <el-button icon="el-icon-location-outline" @click="showMap = !showMap"> Set location</el-button>
          <ChooseLocation v-if="showMap" v-model="syncValue" :doc="doc" />
        </span>

        <el-color-picker v-else-if="field.type == 'color'" v-model="syncValue" :disabled="isDisabled"></el-color-picker>

      </el-form-item>
      <p v-if="errorMsg" class="error">{{errorMsg}}</p>
    </div>
  </el-popover>
</template>

<script>

import { nextId } from '~/fire';

import Schema from "async-validator";

export default {
  name: 'DynamicField',
  components: {
    TipTap: () => import('~/components/TipTapField'),
    ImageField: () => import('~/components/ImageField'),
    ChooseLocation: () => import('~/components/ChooseLocation'),
    TimestampInput: () => import('~/components/TimestampInput'),
    MapField: () => import('~/components/MapField'),
    AttributeField: () => import('~/components/AttrField'),
    ReferenceInput: () => import('~/components/ReferenceInput'),
  },
  props: {
    value: { required: true },
    field: { type: Object, required: true },
    parent: { type: Object },
    label: { type: String },
    disabled: { type: Boolean },
    isInvalid: { type: String },
    doc: { type: Object }
  },
  data () {
    return {
      id: nextId(this.field.key),
      showMap: false,
      errorMsg: this.isInvalid
    }
  },
  watch: {
    isInvalid () {
      this.errorMsg = this.isInvalid
    }
  },
  computed: {
    isSuper () {
      return true || this.$auth.roles['superadmin']
    },
    isDisabled () {
      if (this.isSuper) return false
      return this.field.readonly || this.disabled
    },
    syncValue: {
      get () {
        return this.value
      },
      set (newValue) {
        if (this.field.type === 'boolean')
          newValue = !!newValue
        if (this.field.type === 'number')
          newValue = Number(newValue)
        if (this.field.format)
          newValue = this.field.format(newValue)

        if (this.field.rules) {
          this.errorMsg = ''
          let validator = new Schema({[this.field.key]: this.field.rules})
          validator.validate({[this.field.key]: newValue}, (errors, fields) => {
            if(errors) {
              this.errorMsg = errors[0].message
            }
          })
        }

        this.$emit('input', newValue)
      }
    }
  },
  methods: {
    querySearch (query, cb) {
      let options = this.field.options
      let results = []
      if (query) {
        let lazy = []
        let q = query.toLowerCase()
        results = []
        options.forEach(option => {
          let i = option.toLowerCase().indexOf(q)
          if (i > -1) {
            i === 0 ? results.push({ value: option }) : lazy.push({ value: option })
          }
        })

        if (results.length < 5) results.concat(lazy)

        results = results.slice(0, 50)
      }

      cb(results)
    }
  }
}
</script>

<style lang="scss">
.DynamicField {

  .error {
    color: red;
    width: 100%;
    margin: -11px 0 11px;
    text-align: right;
  }

  .el-form-item__label {
    width: 100px;
    padding: 13px 14px 10px;
    line-height: 18px;
  }

  .el-form-item__content {
    padding-left: 100px;

    > .el-input {
      width: 100%;
    }

    .DynamicField .el-form-item__content > .el-input {
      width: auto;
    }

    .el-form-item__content {
      padding-left: 10%;
    }

    .arrayfields {
      .el-form-item__content {
        padding-left: 0;
      }
      .DynamicField {
        .el-form-item__content {
          padding-left: 80px;
        }

        .object, .array, .map {
          .el-form-item__content {
            padding-left: 40px;
          }
        }
      }
    }
  }

  .object, .array, .map {
    position: relative;

    >.el-form-item__label {
      font-weight: 500;
      width: 100%;
      text-align: center;
      text-decoration: underline;
    }

    >.el-form-item__content {
      padding-left: 10%;
    }

    .object, .array, .map {
      >.el-form-item__label {
        width: 30%;
        text-decoration: none;
      }
    }

    .el-input-group--append, .el-input-group--prepend {
      .el-input__inner {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }

  .remove-field {
    position: absolute;
    right: 2px;
    top: 2px;
    background: #fefefe;
    border-radius: 20px;
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .objectfields {
    padding: 10px;
    display: block;
    width: 100%;
    clear: both;
    background: #eee;
    border-radius: 10px;
  }

  .arrayfields {
    position: relative;
    clear: both;
    display: block;
    padding-left: 20px;

    .el-form-item {
      margin: 0 0 10px -10px;
    }

    .el-input {
      min-width: 200px;
    }

    .image .uploadImage {
      width: 125px;
    }
  }

  .thumbnail {
    border-radius: 20px;
    width: 40px;
    height: 40px;
    object-fit: cover;
    vertical-align: middle;
  }
}
</style>
