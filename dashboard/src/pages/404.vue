<template>
  <Layout>
    <div class="Page Page-Index">
      <h1>Page not found</h1>
      <g-link to="/">Go Home</g-link>
    </div>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: '404'
  },
  mounted() {
    if (typeof window !== 'undefined') {
      this.$router.push(window.location.pathname)
    }
  },
}
</script>