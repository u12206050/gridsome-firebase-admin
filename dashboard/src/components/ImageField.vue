<template>
  <el-button class="ImageField" :disabled="disabled" @click="selectImage">
    <span v-if="!syncValue">Choose bilde</span>
    <img v-else :src="syncValue"/>
  </el-button>
</template>

<script>
export default {
  name: 'ImageField',
  props: {
    value: {type: String},
    private: {type: Boolean},
    disabled: {type: Boolean}
  },
  computed: {
    syncValue: {
      get() {
        return this.value
      },
      set(url) {
        this.$emit("input", url);
      }
    }
  },
  methods: {
    selectImage () {
      this.$store.gallery = {
        visible: true,
        private: !!this.private,
        onSelect: ((url) => {
          this.syncValue = url
        }).bind(this)
      }
    }
  }
}
</script>

<style lang="scss">
.ImageField {
  min-width: 100px;
  width: 100%;
  max-width: 400px;
  max-height: 400px;
  border-radius: 10px;
  padding: 4px;
  background: #eee;
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    border-radius: 5px;
    object-fit:  contain;
  }
}
</style>
