<template>
  <Main>
    <div id="admin">
      <div class="horz-scroll">
        <el-tabs
          :value="collection"
          style="display: flex; justify-content: space-between; align-items: center; padding: 10px;"
          @tab-click="onTab">
          <template v-for="(cType, key) in cTypes">
            <el-tab-pane
              v-if="!cType.parent"
              :key="key"
              :name="cType.url || cType.collection">
              <span slot="label">
                <i v-if="cType.icon" :class="cType.icon"></i>
                <i v-else-if="cType.mdIcon" class="material-icons">{{cType.mdIcon}}</i> {{cType.title}}
              </span>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
      <transition name="fade" mode="out-in">
        <slot/>
      </transition>
    </div>
  </Main>
</template>

<style lang="scss">
.horz-scroll {
  width: 100%;
  overflow: hidden;
  overflow-x: scroll;
}
.el-tabs__nav>div i {
  vertical-align: middle;
}
</style>

<script>
import COLLECTION_TYPES from '~/model/collections'

export default {
  name: 'Admin',
  data () {
    return {
      cTypes: COLLECTION_TYPES,
    }
  },
  computed: {
    collection () {
      return this.$route.params.collection
    }
  },
  methods: {
    onTab (tab) {
      this.$router.push(`/${tab.name}`)
    }
  }
}
</script>
