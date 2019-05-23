<template>
  <Main>
    <div id="dashboard" class="Page Page-Dashboard">
      <el-row :router="true">
        <template v-for="(cType, key) in cTypes">
          <el-col v-if="!cType.parent" :key="key" :span="4" :lg="6" :md="8" :sm="12" :xs="24">
            <router-link :to="`/${cType.url || cType.collection}`">
              <el-card class="actioncard" shadow="hover">
                <i :class="cType.icon"></i>
                <h2 v-text="cType.title"></h2>
              </el-card>
            </router-link>
          </el-col>
        </template>
        <el-col :span="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-button icon="el-icon-picture-outline" @click="$store.gallery = {visible: true}" class="actioncard" style="width: 100%; background: #fff; color: #3BBA95"><h2>Gallery</h2></el-button>
        </el-col>
      </el-row>
    </div>
  </Main>
</template>

<script>
import COLLECTION_TYPES from '~/model/collections'

export default {
  name: "Dashboard",
  data() {
    return {
      cTypes: COLLECTION_TYPES
    };
  },
  computed: {
    user() {
      return this.$store.user;
    },
    selectedAccount() {
      return this.$store.selectedAccount;
    }
  },
  methods: {

  },
  mounted() {

  },
  beforeDestroy() {

  }
};
</script>

<style lang="scss">
#dashboard {
  .actioncard {
    cursor: pointer;
    text-align: center;
    background: linear-gradient(#2c4e8e, #3c69ba);
    color: #ffffff;
    transition: .4s all ease-in-out;

    &:hover {
      background: linear-gradient(#2c4e8e, #3c69ba, #4489c8);
    }

    i {
      display: block;
      margin: 0.5em;
      font-size: 3em;
    }
  }
  h3,
  h5 {
    margin: 0;
  }
}
</style>
