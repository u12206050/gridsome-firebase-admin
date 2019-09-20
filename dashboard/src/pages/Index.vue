<template>
  <Layout>
    <div class="Page Page-Index">
      <h1>What is inside</h1>
      <div class="container">
        <h3>Customizable Dashboard displaying featured collections</h3>
        <g-image style="max-width: 100%; max-height: 85vh; margin: 1rem auto; object-fit: contain; display: block" src="~/assets/screenshots/dashboard.png"></g-image>

        <div style="display: flex; flex-wrap: wrap;">
          <div style="width: calc(100% - 300px); flex: 1;">
            <h3>Customizable Collection view</h3>
            <g-image style="max-width: 100%; max-height: 85vh; margin: 1rem auto; object-fit: contain; display: block" src="~/assets/screenshots/model-view.png"></g-image>

            <h3>Document editor and viewer</h3>
            <g-image style="max-width: 100%; max-height: 85vh; margin: 1rem auto; object-fit: contain; display: block" src="~/assets/screenshots/doc-edit.png"></g-image>
          </div>
          <pre style="font-size: 11px; background: #242424; color: #fff; padding: 11px; width: 340px; margin: 1rem auto; ">
// model/collections/posts.js

...

  fields: [
    {
      key: '__key__',
      label: 'ID',
      type: 'hidden',
      readonly: true
    },
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      width: 120,
      rules: [
        {
          type: 'string',
          required: true,
          message: 'Title is required'
        }
      ]
    },
    {
      key: 'image',
      label: 'Featured Image',
      type: 'image',
      width: 70
    },
    {
      key: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      width: 120,
    },
    {
      key: 'body',
      label: 'Content',
      type: 'tiptap',
      title: (field, val) => {
        return `HTML ${val.length}`
      },
      width: 120,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      title: (field, val) => {
        switch (val*1) {
          case 0: return 'Draft'
          case 1: return 'Published'
        }
      },
      options: [
        { value: '0', label: 'Draft' },
        { value: '1', label: 'Published' }
      ]
    },
    {
      key: 'author',
      label: 'Author',
      type: 'reference',
      collection () {
        return defs.authors
      },
      reference: {
        key: 'fname',
        label: 'Full name',
        type: 'text'
      }
    },
    {
      key: 'gallery',
      label: 'Gallery',
      type: 'array',
      array: {
        key: '__index__',
        label: 'Image',
        type: 'image',
        width: 70
      },
    },
...
          </pre>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
export default {
  metaInfo: {
    title: 'Firesome Serverless CMS'
  }
}
</script>

<style lang="scss">

</style>
