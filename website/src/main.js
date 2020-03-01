// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import DefaultLayout from '~/layouts/Default.vue'
import VueScrollTo from 'vue-scrollto'
import VueFuse from 'vue-fuse'

import VueAnalytics from 'vue-analytics'


export default function (Vue, { router, head, isClient, isServer }) {
  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)

  Vue.use(VueScrollTo, {
    duration: 500,
    easing: "ease",
  })

  Vue.use(VueFuse)

  Vue.use(VueAnalytics, {
    id: 'UA-159413433-1',
    disabled: false,
    debug: {
      sendHitTask: process.env.NODE_ENV === 'production'
    },
    router
  })

  head.meta.push({
    name: 'keywords',
    content: 'Gridsome,Vue,Tailwind,Tailwind CSS,JavaScript,HTML,CSS,Vue.js,VueJS,Portfolio,Python,React Native,Software Engineer,Developer'
  })

  head.meta.push({
    name: 'description',
    content: 'Peronsal website for Bristol software engineer Mitchell Harle'
  })

  head.meta.push({
    name: 'author',
    content: 'Mitchell Harle'
  })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700'
  })
}
