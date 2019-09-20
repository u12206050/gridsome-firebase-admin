<template>
  <Admin>
    <div id="admin_collections">
      <h2>{{selected && selected.title}}</h2>
      <CollectionTable
        v-if="selected"
        :collection="selected.collection"
        :singular="selected.singular"
        :plural="selected.plural"
        :title="selected.title"
        :fields="selected.fields"
        :actions="selected.actions"
        :query="selected.query"
        :subs="selected.subs"
        :parent="selected.parent"
        :parentId="parentId"
      />
    </div>
  </Admin>
</template>

<script>
import Admin from '~/layouts/Admin'
import CollectionTable from '~/components/CollectionTable'
import COLLECTION_TYPES from '~/model/collections'

export default {
  name: 'Collections',
  components: { Admin, CollectionTable },
  data() {
    return {
      parentId: null
    }
  },
  computed: {
    selected () {
      const { collection } = this.$route.params
      console.log(collection)

      const parts = collection.split('/')

      const type = parts.pop()
      this.parentId = parts.length ? parts.pop() : null

      if (type) return COLLECTION_TYPES.find(t => t.collection === type || t.url === type)
      return null
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
