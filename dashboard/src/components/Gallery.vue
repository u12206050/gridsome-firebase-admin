<template>
  <el-dialog :visible="gallery.visible" @close="$store.gallery = {visible: false}" :fullscreen="true">
    <div id="FireGallery">
      <el-row :gutter="20">
        <el-col :span="20" :md="18" :sm="16" :xs="12" class="main">
          <el-input placeholder="Søk" v-model="query" @input="onFilter">
            <el-checkbox slot="prepend" v-model="privateView" @change="onFilter">Bruker bilder</el-checkbox>
            <span slot="append">{{filtered.length}} / {{images.length}}</span>
          </el-input>
          <hr style="border: 1px solid #eeeeee;box-shadow:  0px 1px 10px;margin: 10px -10px;">
          <div class="scrollable">
            <StackGrid
              :columnWidth="colWidth"
              :gutterX="8"
              :gutterY="8">
              <div class="vsg-stack-item" v-for="(img, i) in filtered" :key="i">
                <figure :class="{selected: img === selected, removing: img.removing}"
                  @click="selected = img">
                  <img :src="img.url" @load="imageLoaded">
                  <figcaption>{{img.name || img.file.name}}</figcaption>
                </figure>
              </div>
            </StackGrid>
          </div>
        </el-col>
        <el-col :span="4" :md="6" :sm="8" :xs="12">
          <div class="scrollable">
            <h3>Upload a new Image</h3>
            <h5 v-if="isPrivate" style="color: red; margin: 0">Upload user image</h5>
            <el-upload
              drag
              multiple
              action="/images/"
              list-type="picture"
              :show-file-list="false"
              :file-list="fileList"
              :http-request="upload"
              :before-upload="beforeImageUpload">
              <el-progress v-if="uploadProgress" type="circle" :percentage="uploadProgress" color="blue"></el-progress>
              <i v-if="!uploadProgress" class="el-icon-upload"></i>
              <div v-if="!uploadProgress" class="el-upload__text">Drag and drop image or <em>click to select</em></div>
              <div class="el-upload__tip" slot="tip">Only jpg/png images allowed upto 16mb in size</div>
            </el-upload>
            <hr />
            <div v-if="selected">
              <h3>{{selected.name || selected.file.name}}</h3>
              <h4>{{selected.uploaded.toDate().toDateString()}} <el-button type="danger" icon="el-icon-delete" round @click="remove(selected)" v-loading="selected.removing" style="float: right"></el-button></h4>
              <h5>Dimensions: {{selected.size.w}} x {{selected.size.h}}</h5>
              <h5>Owner: {{auth.uid === selected.uid ? auth.displayName : '––––'}}</h5>
              <el-input :placeholder="selected.name || 'Navn'" v-model="selected.__newName" v-on:keyup.enter="changeName(selected)">
                <el-button slot="append" type="success" icon="el-icon-check" @click="changeName(selected)" v-loading="selected.updating">Update</el-button>
              </el-input>
            </div>
          </div>
          <div class="actions" v-if="selected && gallery.onSelect">
            <el-button type="success" icon="el-icon-check" :disabled="selected.private !== isPrivate" round @click="select">Choose</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>


<style lang="scss">
.el-dialog.is-fullscreen {
  background: #fafafa;
}

#FireGallery {
  .main {
    box-shadow: 0px 0px 10px #ccc inset;
    background: #eee;
    padding: 10px;
  }
  .scrollable {
    position: relative;
    height: calc(100vh - 160px);
    overflow-y: scroll;
  }
  .actions {
    text-align: center;
    padding: 12px;
    margin: 10px -2px 0;
    background: linear-gradient(#fff, #fafafa);
    box-shadow: 0 -4px 10px -2px rgba(0, 0, 0, 0.1);
    position: relative;
  }
  .vsg-stack-item {
    figure {
      margin: 0;
      transition: .2s all;
      box-shadow: 0px 2px 10px #ccc;
      padding: 2px;
      background: #000;
      cursor: pointer;

      figcaption {
        color: #fff;
        padding: 4px;
        font-size: 15px;
      }

      img {
        width: 100%;
        max-width: 400px;
        min-height: 50px;
      }

      &:hover {
        box-shadow: 0px 2px 20px #333333;
      }

      &.selected {
        box-shadow: 0px 2px 20px #333333;
        background: #2F80ED;
      }

      &.removing img {
        filter: grayscale(1);
      }
    }
  }

  .el-upload {
    width:  100%;
    .el-upload-dragger {
      max-width: 100%;
    }
  }
}
</style>

<script>
import Upload from './bases/Upload'
import StackGrid from 'vue-stack-grid-component'

let delay
export default {
  extends: Upload,
  name: 'Gallery',
  components: {
    StackGrid
  },
  data () {
    return {
      images: [],
      imagesLoaded: 0,
      filtered: [],
      query: '',
      uploaded: null,
      selected: null,
      colWidth: 220,
      privateView: false
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    gallery () {
      let G = this.$store.gallery
      this.isPrivate = this.privateView = G && G.private
      this.onFilter()
      return G
    },
    auth () {
      return this.$auth.currentUser
    }
  },
  methods: {
    select () {
      if (this.selected.private === this.isPrivate) {
        this.gallery.onSelect && this.gallery.onSelect(this.selected.url)
        this.$store.gallery = {visible: false}
      }
    },
    onFilter () {
      if (delay) clearTimeout(delay)
      delay = setTimeout(() => {
        let q = this.query.toLowerCase()
        if (!q) this.filtered = this.images
        let curSel = this.selected ? this.selected.id : null
        this.selected = null
        this.filtered = this.images.filter(img => {
          if (!this.privateView !== !img.private) return false
          if ((img.name || img.file.name).toLowerCase().includes(q)) {
            if (curSel === img.id) this.selected = img
            return true
          }
          return false
        })
        this.$forceUpdate()
      }, 100)
    },
    init () {
      this.$bind(this.$db.collection('media').orderBy('uploaded', 'desc'), 'images', (images) => {
        if (!images) return
        images.forEach(img => {
          img.file = this.$storage.ref(img.path)
        })
        this.imagesLoaded = images.length
        this.onFilter()
        this.privateView = this.isPrivate
        this.colWidth = 219
      })
    },
    imageLoaded () {
      if (--this.imagesLoaded < 1) {
        this.imagesLoaded = 0
        this.$nextTick(() => {
          this.colWidth = 220
        })
      }
    },
    remove (img) {
      img.removing = true
      var imgRef = this.$storage.ref(img.path);

      img.__ref__.delete().then(() => {
        this.$message({
          message: 'Image deleted',
          type: 'success'
        })
        this.selected = null
      }).catch((error) => {
        this.$message({
          message: error.message,
          type: 'warning'
        })
      })
      /*imgRef.delete().catch((error) => {
        console.warn(error.message)
      })*/
    },
    changeName (img) {
      img.updating = true
      img.__ref__.update({
        name: img.__newName
      }).then(() => {
        img.__newName = ''
        img.updating = false
        this.$message({
          message: 'Name changed',
          type: 'success'
        })
      })
    }
  }
}
</script>
