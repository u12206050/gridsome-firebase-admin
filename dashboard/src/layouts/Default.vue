<template>
  <div id="app" class="page-container md-layout-row">
    <el-container>
      <el-header class="secondary-theme main">
        <el-row type="flex" justify="space-between" align="middle">
          <g-link to="/">
            <g-image src="~/assets/logo-light.svg" width="120" alt="Firesome Logo" class="logo"></g-image>
          </g-link>
          <el-row type="flex" justify="space-between" align="middle">
            <a class="btn" style="margin: 0 1rem; height: 32px" href="https://github.com/u12206050/gridsome-firebase-admin">
              <svg style="fill: #fff" width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>GitHub</title><path d="M10 0a10 10 0 0 0-3.16 19.49c.5.1.68-.22.68-.48l-.01-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69a3.6 3.6 0 0 1 .1-2.64s.84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.37.2 2.4.1 2.64.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85l-.01 2.75c0 .26.18.58.69.48A10 10 0 0 0 10 0"></path></svg>
            </a>
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
