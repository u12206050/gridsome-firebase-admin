import Vue from 'vue'
import firesync from './firesync'

const config = {
  apiKey: process.env.GRIDSOME_API_KEY,
  authDomain: process.env.GRIDSOME_AUTH_DOMAIN,
  databaseURL: process.env.GRIDSOME_DATABASE_URL,
  projectId: process.env.GRIDSOME_PROJECT_ID,
  storageBucket: process.env.GRIDSOME_STORAGE_BUCKET,
  messagingSenderId: process.env.GRIDSOME_MESSAGING_SENDER_ID
}

let $tmpauth = Vue.observable({
  isLoggedIn: false
})
let storage = {}
Vue.prototype.$db = {}
Vue.prototype.$functions = {}
Vue.prototype.$storage = storage
Vue.prototype.$auth = $tmpauth
Vue.prototype.$firestore = {}

function initializeFirebase() {

  firebase.initializeApp(config)
  const firestore = firebase.firestore
  const db = firestore()
  db.enablePersistence()

  const functions = firebase.functions()
  storage = firebase.storage()

  /* Manage auth state */
  const auth = firebase.auth()
  auth.setPersistence(firebase.auth.Auth.Persistence.SESSION)

  auth.isLoggedIn = false
  auth.roles = {}
  auth.userId = null
  const $auth = Vue.observable(auth)

  const onCurrentUser = (currentUser) => {
    if (currentUser) {
      $auth.isLoggedIn = true
      $auth.userId = currentUser.uid
      currentUser.getIdTokenResult().then(userToken => {
        $auth.roles = userToken.claims
      })
      firesync.onLogin(db, $auth.userId)
    } else {
      $auth.userId = null
      $auth.isLoggedIn = false
      $auth.roles = {}
      firesync.onLogout()
    }
  }

  auth.onAuthStateChanged(onCurrentUser)

  setTimeout(() => {
    if (auth.currentUser)
      onCurrentUser(auth.currentUser)
  }, 1000)

  $tmpauth.isLoggedIn = true
  Vue.prototype.$firebase = firebase
  Vue.prototype.$db = db
  Vue.prototype.$functions = functions
  Vue.prototype.$auth = $auth
  Vue.prototype.$storage = storage
  Vue.prototype.$firestore = firestore

  firesync.onInit(db)

  console.log('%c Firebase locked and loaded!', 'background: #ffcb2c; color: #f5820b');
}

console.log('%c Awaiting firebase!', 'background: #f5820b; color: #ffcb2c');

if (typeof window !== 'undefined') {
  if (typeof firebase !== 'undefined') initializeFirebase()
  else window.addEventListener('firebase-loaded', initializeFirebase)
}


/**
 *  Uploads a file under a user's directory
 *
 * @param {String} path : Full path and file name of where to store file
 * @param {File} file : A File from an input (eg. e.target.files[0]) or the file api
 * @param {Function} onComplete : Executed when the file uploaded successfully
 * @param {Function} onError : Executed when an error occured
 * @param {Function} onProgress : Executed on progress update, percentage parameter given as argument
 * @param {Object} meta : customMetadata to be added to the file
 */
export const uploadFile = function (path, file, onComplete, onError, onProgress, meta = null) {
  path = path.replace(/^\/+|\/+$/g, '')
  if (!path || !file || !onComplete) {
    onError('Invalid execution')
    return
  }
  const storageRef = storage.ref(path)

  storageRef.put(file, {
    customMetadata: meta
  }).on('state_changed',
    (snapshot) => { onProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100) },
    onError,
    () => {
      storageRef.getDownloadURL().then(url => onComplete(url, storageRef.fullPath, meta)).catch(onError)
    }
  )
}

/**
 * Simply returns a unique incremented value each time
 * Within the scope of one session this will always be unique
 *
 * @param {String} prefix (optional): Adds the prefix infront of the nextid
 */
let nextIdCounter = 100
export const nextId = function (prefix) {
  nextIdCounter++
  return prefix ? prefix + '_' + nextIdCounter : nextIdCounter.toString()
}

/**
 * Returns a filename based on today's date. Use when uploading files to storage
 *
 * @param {String} extenstion : The file's extension to be added to the end of the filename
 */
export const getFileName = function (extenstion) {
  if (!extenstion) throw new Error('Extension arugment required')
  let d = (new Date()).toISOString()
  d = nextId(d.substr(2, 16).replace(/-|:/g, ''))
  return `u${d}.${extenstion}`
}