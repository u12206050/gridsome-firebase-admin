// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import DefaultLayout from '~/layouts/Default.vue'
import MainLayout from '~/layouts/Main.vue'
import TableCell from '~/components/TableCell.vue'
import DynamicField from '~/components/DynamicField.vue'
import Loading from '~/components/Loading.vue'

import * as VueGoogleMaps from 'vue2-google-maps'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/display.css'
import '~/assets/element-variables.scss'

import '~/fire.js'

export default function (Vue, { router, head, isServer, isClient }) {

  Vue.use(ElementUI, { locale })

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyBU3hjNGURMkXD6IOQDYLFDm8kbCXMOWm4'
    }
  })

  // Set default global components
  Vue.component('Layout', DefaultLayout)
  Vue.component('Main', MainLayout)
  Vue.component('TableCell', TableCell)
  Vue.component('DynamicField', DynamicField)
  Vue.component('Loading', Loading)

  // External cdn libraries
  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
  }, {
    rel: 'stylesheet',
    href: 'https://unpkg.com/vue-notifyjs/themes/material.css'
  }, {
    rel: 'stylesheet',
    href: 'https://cdn.firebase.com/libs/firebaseui/4.2.0/firebaseui.css'
  })

  head.script.push({
    rel: 'javascript',
    src: '/fireInit.js'
  })
}
