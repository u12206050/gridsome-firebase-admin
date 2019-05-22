<template>
  <Main>
    <div id="dashboard" class="Page Page-Dashboard">
      <el-row :router="true">
        <el-col :span="4" :lg="6" :md="8" :sm="12" :xs="24">
          <router-link to="/product_types">
            <el-card class="actioncard" shadow="hover">
              <i class="el-icon-user-solid"></i>
              <h2>Authors</h2>
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="4" :lg="6" :md="8" :sm="12" :xs="24">
          <router-link to="/posts">
            <el-card class="actioncard" shadow="hover">
              <i class="el-icon-document"></i>
              <h2>Posts</h2>
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="4" :lg="6" :md="8" :sm="12" :xs="24">
          <router-link to="/topics">
            <el-card class="actioncard" shadow="hover">
              <i class="el-icon-collection"></i>
              <h2>Topics</h2>
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="4" :lg="6" :md="8" :sm="12" :xs="24">
          <router-link to="/tags">
            <el-card class="actioncard" shadow="hover">
              <i class="el-icon-collection-tag"></i>
              <h2>Tags</h2>
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="4" :lg="6" :md="8" :sm="12" :xs="24">
          <router-link to="/users">
            <el-card class="actioncard" shadow="hover">
              <i class="el-icon-user"></i>
              <h2>Users</h2>
            </el-card>
          </router-link>
        </el-col>
        <el-col :span="4" :lg="6" :md="8" :sm="12" :xs="24">
          <el-button icon="el-icon-picture-outline" @click="$store.gallery = {visible: true}" class="actioncard" style="width: 100%; background: #fff; color: #3BBA95"><h2>Gallery</h2></el-button>
        </el-col>
      </el-row>
    </div>
  </Main>
</template>

<script>
export default {
  name: "Dashboard",
  data() {
    return {

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
