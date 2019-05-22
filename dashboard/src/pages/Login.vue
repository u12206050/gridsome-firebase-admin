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
    title: 'Login | Firesome Headless CMS'
  },
  components: { Login }
}
</script>

<style lang="scss">

</style>
