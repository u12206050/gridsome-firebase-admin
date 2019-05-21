<template>
  <el-date-picker value-format="timestamp" v-model="syncValue" :type="type" :placeholder="placeholder" :disabled="disabled"></el-date-picker>
</template>

<style lang="scss">

</style>

<script>
import { Timestamp } from '~/fire'

export default {
  name: 'TimestampInput',
  props: {
    value: {required: true},
    type: {type: String, required: true},
    placeholder: {type: String},
    disabled: {type: Boolean}
  },
  computed: {
    syncValue: {
      get() {
        if (typeof this.value === 'object') {
          if (this.value.constructor === firebase.firestore.Timestamp)
            return this.value.toDate()
          return this.value
        }

        return isNaN(this.value) ? this.value : new Date(this.value)
      },
      set(newValue) {
        this.$emit("input", new Date(newValue))
      }
    }
  }
}
</script>

