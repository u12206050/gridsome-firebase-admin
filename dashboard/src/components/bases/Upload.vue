<script>
import * as UUID from 'uuidv4'
import {uploadFile, getFileName, Timestamp} from '@/fire'

export default {
  name: 'Upload',
  data () {
    return {
      uploadProgress: 0,
      fileList: [],
      isPrivate: false
    }
  },
  computed: {
    auth () {
      return this.$store.state.auth
    }
  },
  methods: {
    upload (uploader) {
      let file = uploader.file
      let ext = file.type.slice(6)
      let path = this.auth.uid + uploader.action + 'new-' + getFileName(ext)
      uploadFile(path, file,
        this.onUploadSuccess,
        this.onUploadError,
        this.onUploadProgress,
        {
          uuid: UUID(),
          u: this.auth.uid,
          p: !!this.isPrivate ? '1' : 0
        })
    },
    onUploadProgress (percentage) {
      this.uploadProgress = Math.ceil(percentage)
    },
    onUploadSuccess (url, path, meta) {
      this.$message({
        message: 'Image uploaded... Optimizing',
        type: 'info'
      })
      const unsub = this.$db.collection('media').doc(meta.uuid).onSnapshot(sMedia => {
        if (sMedia.exists) {
          unsub()
          this.uploadProgress = 0
          this.$message({
            message: 'Image optimized',
            type: 'info'
          })
          this.$emit('uploaded', sMedia.data().url)
        }
      })
    },
    onUploadError (err) {
      console.warn(err)
      this.uploadProgress = 0
      this.$message({
        message: 'Failed upoading the image',
        type: 'error'
      })
    },
    beforeImageUpload (file) {
      const isImage = /image\/(gif|jpg|jpeg|png)$/i
      const isLt2M = file.size / 1024 / 1024 < 16

      if (!(isImage).test(file.type)) {
        this.$message.error('Image must be of type gif|jpg|jpeg|png')
      }
      if (!isLt2M) {
        this.$message.error('Image size can not exceed 16MB!')
      }
      return isImage && isLt2M
    }
  }
}
</script>
