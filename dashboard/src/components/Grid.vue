<template>
  <div class="Grid">
    <input class="slider" type="range" v-model="width" step="10" min="120" max="600">
    <div class="grid-stack">
      <template class="grid-item" v-for="(img, i) in images">
        <figure class="grid-item" :key="i"
          :class="{selected: img === value, removing: img.removing}"
          :style="{width: `${width}px`}"
          @click="select(img)">
          <img :src="img.url">
          <figcaption>{{img.name || img.file.name}}</figcaption>
        </figure>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.Grid {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .slider {
    height: 24px;
    width: 400px;
    margin: 0 auto;
    display: block;
  }
  .grid-stack {
    height: calc(100% - 24px);
    min-width: 100%;
    overflow-x: scroll;
    display: flex;
    flex-direction: column;
    flex-flow: column wrap;
    align-content: flex-start;

    figure.grid-item {
      margin:5px;
      max-width: 90%;
      min-width: 10vw;
      transition: .2s all;
      box-shadow: 0px 2px 10px #ccc;
      padding: 2px;
      background: #000;
      cursor: pointer;

      figcaption {
        color: #fff;
        padding: 4px;
        font-size: 15px;
      }

      img {
        width: 100%;
        min-height: 50px;
      }

      &:hover {
        box-shadow: 0px 2px 20px #333333;
      }

      &.selected {
        box-shadow: 0px 2px 20px #333333;
        background: #2F80ED;
      }

      &.removing img {
        filter: grayscale(1);
      }
    }
  }
}
</style>

<script>
export default {
  props: ['value','images'],
  data() {
    return {
      width: 220
    }
  },
  methods: {
    select(img) {
      this.$emit('input', img)
    }
  }
}
</script>
