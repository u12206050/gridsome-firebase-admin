<template>
  <div class="Login">
    <div v-show="!$auth.isLoggedIn" :id="id"></div>
    <Loading v-if="loading" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      id: `firebaseui-${Date.now()}`
    }
  },
  methods: {
    init() {
      const v = this
      if (typeof window !== 'undefined') {
        if (typeof firebaseui === 'undefined') {
          setTimeout(() => {
            v.init()
          }, 500)
        } else if (window.firebaseAuthUi) {
          document.getElementById(v.id).append(window.firebaseAuthUi.F.a)
          v.loading = false
        } else {
          window.firebaseAuthUi = new firebaseui.auth.AuthUI(v.$auth)
          window.firebaseAuthUi.start(`#${this.id}`, {
            callbacks: {
              signInSuccessWithAuthResult (authResult, redirectUrl) {
                // User successfully signed in
                v.$emit('success', v.$auth.currentUser)

                return false;
              },
              uiShown () {
                v.loading = false
              }
            },
            signInFlow: 'popup',
            signInOptions: [
              // Email address and password
              //firebase.auth.EmailAuthProvider.PROVIDER_ID,

              // List of OAuth providers supported.
              firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
              // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
              // firebase.auth.GithubAuthProvider.PROVIDER_ID,

              // Phone number
              // firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
          })
        }
      }
    },
  },
  mounted() {
    this.init()
  }
}
</script>

<style lang="scss">
.Login {
  width: 100%;
}
</style>

