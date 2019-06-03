<template>
  <div id="app" class="page-container md-layout-row">
    <el-container v-if="isLoggedIn"
      v-loading="!isAdmin"
      :element-loading-text="loadingMsg"
      element-loading-spinner="el-icon-loading"
      element-loading-color="#3BBA95"
      element-loading-background="rgb(255, 255, 255, 0.8)">
      <el-aside style="width: auto;" class="secondary-theme">
        <el-menu background-color="#F3F7F9" text-color="#000" class="el-sidemenu el-sidemenu-head" :collapse="menuToggle">
          <g-image v-if="authUser.photoURL " :src="authUser.photoURL" alt="avatar" class="avatar" @click="menuToggle = !menuToggle"></g-image>
          <g-image v-else src="../assets/no-image.svg" alt="avatar" class="avatar" @click="menuToggle = !menuToggle"></g-image>
        </el-menu>
        <el-menu :router="true" background-color="#F3F7F9" text-color="#000" active-text-color="#0D2538" class="el-sidemenu" :collapse="menuToggle">
          <el-menu-item index="/dashboard">
            <i class="material-icons">dashboard</i>
            <span slot="title">Dashboard</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <i class="el-icon-user"></i>
            <span slot="title">Profile</span>
          </el-menu-item>
          <hr/>
          <el-menu-item index="/admin" v-if="isAdmin">
            <i class="el-icon-setting"></i>
            <span slot="title">Admin</span>
          </el-menu-item>
          <el-button type="text" @click="menuToggle = !menuToggle" style="width: 100%; text-align: center;" :icon="menuToggle ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></el-button>
        </el-menu>
      </el-aside>

      <el-container style="background-color: #f3f3f3">
        <el-header class="secondary-theme main">
          <el-row type="flex" justify="space-between">
            <g-link to="/" style="height: 40px; display: inline-block">
              <g-image src="~/assets/logo-light.svg" width="120" height="49px" alt="Firesome Logo" class="logo"></g-image>
            </g-link>
            <el-col :span="12" style="text-align: right; margin-right: 20px">
              <el-row type="flex" style="align-items: center;" justify="end">
                <el-button><g-link to="/profile">{{authUser.displayName}}</g-link></el-button>
                <el-button type="text" size="small" @click="logout" style="position: relative; z-index: 1999;"><i class="material-icons">lock_outline</i></el-button>
              </el-row>
            </el-col>
          </el-row>
        </el-header>

        <el-main style="position: relative">
          <transition name="fade" mode="out-in">
            <slot></slot>
          </transition>
          <ClientOnly>
            <Gallery />
          </ClientOnly>
        </el-main>

        <el-footer class="main">
          <el-row type="flex" justify="space-between">
            <p>Developed by <a href="https://day4.no" style="color: black"><b>DAY4_</b></a></p>
            <p>Powered by <a href="https://gridsome.org" style="color: green">Gridsome</a> & <a href="https://firebase.google.com" style="color: orangered">Firebase</a></p>
          </el-row>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { firebase, db } from '~/fire'
import Gallery from '~/components/Gallery'

import COLLECTION_TYPES from '~/model/collections'

export default {
  name: 'app',
  data () {
    return {
      menuToggle: true,
      cTypes: COLLECTION_TYPES
    }
  },
  components: { Gallery },
  computed: {
    isLoggedIn () {
      return this.$auth.isLoggedIn
    },
    isAdmin() {
      return true || this.$auth.roles['admin']
    },
    user () {
      return this.$store.user
    },
    authUser() {
      return this.$auth.currentUser
    },
    roles () {
      return this.$auth.roles
    },
    loadingMsg () {
      if (!this.user) return 'Initiating your account...'
      return 'Loading...'
    }
  },
  watch: {
    '$auth.isLoggedIn': {
      immediate: true,
      handler(loggedIn) {
        if (!loggedIn) {
          this.$store.hasShown = false
          this.$router.push('/login')
        } else if (!this.$store.hasShown && !this.$auth.emailVerified) {
          this.$store.hasShown = true
          setTimeout(() => {
            this.$message({
              message: 'Verification required, Please verify your email！',
              duration: 30000,
              type: 'warning',
              showClose: true
            })
          }, 2000)
        }
      }
    }
  },
  methods: {
    logout () {
      this.$auth.signOut()
    }
  },
}
</script>

<style lang="scss">
@import '../assets/styles';

#app {
  height: 100vh;
  width: 100vw;
  display: flex;
}

.build-badge {
  margin: 14px 48px 0;
  float: right;
}

.el-header.main {
  background: #0D2538;
  padding: 6px 10px; height: 65px;
  box-shadow: 0 12px 10px -10px rgba(0,0,0,0.2);
}

.el-footer.main {
  box-shadow: 0 -5px 10px -5px rgba(0,0,0,0.2);
  z-index: 2;
}

.el-sidemenu {
  border: none;

  &:nth-child(2) {
    flex-grow: 1
  }

  &:not(.el-menu--collapse) {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  hr {
    border: 0.5px solid #c3bcae;
  }

  &.el-sidemenu-head {
    display: flex;
    height: 65px;
    border-bottom: 1px solid #c3bcae;

    .avatar {
      margin: 0;
      width: 64px;
      height: 64px;
      object-fit: cover;
    }
  }
}
</style>
