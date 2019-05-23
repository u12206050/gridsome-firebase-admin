<template>
  <Main>
    <div v-if="authUser" id="ProfilePage">
      <el-row type="flex" style="align-items: center; padding: 10px;" justify="space-between">
        <el-col :span="6">
          <h2>Update Profile</h2>
        </el-col>
        <el-col :span="6" style="text-align: right">
          <el-button v-if="!authUser.emailVerified" @click="sendVerificationMail">Send verification email</el-button>
          <el-button @click="resetPassword">Reset Password</el-button>
        </el-col>
      </el-row>
      <hr/>
      <el-row type="flex" style="align-items: center; padding: 40px 10px; background: #fff;" justify="center">
        <el-col :span="4" :md="6" :xs="8">
          <ImageField v-model="form.image" :private="true" />
        </el-col>
        <el-col :span="8" :lg="10" :md="12" :sm="14" :xs="16">
          <el-form v-show="!busy" ref="form" :rules="rules" :model="form" label-width="120px" :status-icon="true">
            <el-form-item label="Navn" prop="fullname">
              <el-input v-model="form.fullname" placeholder="Navn" maxlength="25" required></el-input>
            </el-form-item>
            <el-form-item label="Epost" prop="email">
              <el-input v-model="form.email" type="email" placeholder="Epost" maxlength="50" required></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="update" v-loading.fullscreen.lock="busy">Update</el-button>
              <el-button @click="resetForm">Reset</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
  </Main>
</template>

<script>
import { uploadFile, getFileName } from '~/fire'
import ImageField from '~/components/ImageField'

export default {
  name: 'profile',
  components: {ImageField},
  data () {
    return {
      sending: false,
      busy: 0,
      max: 0,
      form: {
        fullname: '',
        email: '',
        photoURL: ''
      },
      rules: {
        fullname: [
          {
            type: 'string',
            required: true,
            message: 'Navn er påkrevd.'
          },
          {
            pattern: /^(([a-zåøæàáâäãåąčćęèéêëėįìíîïłńòóôöõùúûüųūÿýżźñçčšž-]){2,}((\ ([a-zåøæàáâäãåąčćęèéêëėįìíîïłńòóôöõùúûüųūÿýżźñçčšž-]){2,})+))$/i,
            message: 'Ugyldig navn (Navn Etternavn)',
          }
        ],
        email: [
          { type: 'email', required: true, message: 'Please enter a valid email', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    user () {
      this.resetForm()
    }
  },
  computed: {
    authUser () {
      return this.$auth.currentUser
    },
    user () {
      return this.$store.user
    }
  },
  methods: {
    setBusy (p) {
      if (!p) {
        this.max = this.busy = 0
      } else {
        this.busy += p
        if (this.busy > this.max) this.max = this.busy
      }
    },
    resetForm () {
      this.form = {
        fullname: this.user ? this.user.fullname : '',
        email: this.user ? this.user.email : '',
        image: this.user ? this.user.image : ''
      }
    },
    update () {
      let userData = {}
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message({
            message: 'Please fill in all fields',
            type: 'warning'
          })
        } else {
          if (!this.user || (this.form.fullname !== this.user.fullname || this.form.image !== this.user.image)) {
            userData.fullname = this.form.fullname
            userData.image = this.form.image
            this.setBusy(1)
            this.authUser.updateProfile({
              displayName: this.form.fullname,
              photoURL: this.form.image
            }).then(() => {
              if (!userData.email) {
                this.$db.collection('users').doc(this.authUser.uid).set(userData, { merge: true }).then(() => {
                  this.$message({
                    message: 'Navn er oppdatert',
                    type: 'success'
                  })
                  this.setBusy(-1)
                })
              } else {
                this.setBusy(-1)
              }
            }, (error) => {
              console.warn(error)
              this.$message({
                message: 'Failed updating your profile',
                type: 'error'
              })
              this.setBusy(0)
            })
          }

          if (!this.user || (this.form.email !== this.authUser.email || this.form.email !== this.user.email)) {
            this.authUser.reauthenticateWithPopup(firebase.auth.GoogleAuthProvider).then((res) => {
              userData.email = this.form.email
              this.setBusy(2)
              this.authUser.updateEmail(this.form.email).then(() => {
                this.setBusy(-1)
                this.$db.collection('users').doc(this.authUser.uid).update(userData).then(() => {
                  this.setBusy(-1)
                  this.$message({
                    message: 'Profile updated',
                    type: 'success'
                  })
                })
              }).catch((error) => {
                console.error(error)
                this.$message({
                  message: 'Failed updating your email address',
                  type: 'error'
                })
                this.setBusy(0)
              })
            }).catch((error) => {
              this.$message({
                message: error.message,
                type: 'error'
              })
            })
          }
        }
      })
    },
    sendVerificationMail () {
      this.authUser.sendEmailVerification().then(() => {
        this.$message({
          message: 'Verification email has been sent. Check your inbox.',
          type: 'success'
        })
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: 'Failed sending verification email.',
          type: 'error',
          showClose: true
        })
      })
    },
    resetPassword () {
      this.$auth.sendPasswordResetEmail(this.authUser.email, {url: 'https://admin.gridsome.no'}).then(() => {
        this.$message({
          message: 'Reset password email sent, check your inbox',
          type: 'success'
        })
      }).catch((error) => {
        console.error(error)
        this.$message({
          message: 'Failed sending reset password email.',
          type: 'error',
          showClose: true
        })
      });
    }
  },
  mounted () {
    this.resetForm()
  }
}
</script>
