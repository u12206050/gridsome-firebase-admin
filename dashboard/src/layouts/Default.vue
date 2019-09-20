<template>
  <div id="app" class="page-container md-layout-row">
    <el-container>
      <el-header class="secondary-theme main">
        <el-row type="flex" justify="space-between" align="middle">
          <g-link to="/">
            <g-image src="~/assets/logo-light.svg" width="120" alt="Firesome Logo" class="logo"></g-image>
          </g-link>
          <el-row type="flex" justify="space-between">
            <el-button v-if="loggedIn">
              <g-link to="/dashboard">Dashboard</g-link>
            </el-button>
            <el-button v-else>
              <g-link to="/login">Login</g-link>
            </el-button>
          </el-row>
        </el-row>
      </el-header>

      <el-main style="position: relative">
        <transition name="fade" mode="out-in">
          <slot></slot>
        </transition>
      </el-main>

      <el-footer class="main">
        <el-row type="flex" justify="space-between">
          <p>Developed by <a href="https://day4.no" style="color: black"><b>DAY4_</b></a></p>
          <p>Powered by <a href="https://gridsome.org" style="color: green">Gridsome</a> & <a href="https://firebase.google.com" style="color: orangered">Firebase</a></p>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Login from '~/components/Login'
export default {
  components: { Login },
  computed: {
    loggedIn() {
      return this.$auth.isLoggedIn
    }
  }
}
</script>


<style lang="scss">
.Login {
  margin: -12px 0;
}
</style>
