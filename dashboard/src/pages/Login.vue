<template>
  <Layout>
    <div class="Page Page-Login">
      <h1>Login || Register</h1>
      <Login />
    </div>
  </Layout>
</template>

<script>
import Login from '~/components/Login'
export default {
  metaInfo: {
    title: 'Login | Firesome Serverless CMS'
  },
  components: { Login },
  sub: null,
  watch: {
    '$auth.isLoggedIn': {
      immediate: true,
      handler(loggedIn) {
        if (loggedIn) this.$router.push('/dashboard')
      }
    },
  },
}
</script>

<style lang="scss">

</style>
