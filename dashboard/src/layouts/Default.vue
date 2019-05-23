<template>
  <div id="app" class="page-container md-layout-row">
    <el-container>
      <el-header class="secondary-theme main">
        <el-row type="flex" justify="space-between" align="middle">
          <g-link to="/" style="height: 40px; display: inline-block">
            <g-image src="~/assets/logo-light.svg" width="120" height="49px" alt="Firesome Logo" class="logo"></g-image>
          </g-link>
          <el-row type="flex" justify="space-between">
            <g-link v-if="loggedIn" to="/dashboard">Dashboard</g-link>
            <g-link v-else to="/login">Login</g-link>
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
export default {
  computed: {
    loggedIn() {
      return this.$auth.isLoggedIn
    }
  }
}
</script>
