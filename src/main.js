import Vue from 'vue'

// FIREBASE

import * as firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyBtPBUI_t7ltfc5HkCbYDIpCQOxx9_fwdo",
    authDomain: "blog-vue-1.firebaseapp.com",
    databaseURL: "https://blog-vue-1.firebaseio.com",
    projectId: "blog-vue-1",
    storageBucket: "blog-vue-1.appspot.com",
    messagingSenderId: "1026661253621"
  };

firebase.initializeApp(firebaseConfig);



// VUE RESOURCE

import VueResource from 'vue-resource'

Vue.use(VueResource);

Vue.http.options.root = "https://blog-vue-1.firebaseio.com";

Vue.http.interceptors.push((request, next) => {

	if(globalData.token !== null && firebase.auth().currentUser)
	{
		request.params['auth'] = globalData.token;
	    next();
	}
	else
	{
		next();
	}
});



// VUE ROUTER

import VueRouter from 'vue-router'
import Routes from './routes'

Vue.use(VueRouter);

const router = new VueRouter({
    routes: Routes,
    mode: 'history',
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
	}
});



// MOMENT

import moment from 'moment'

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(value).format('DD/MM/YYYY hh:mm')
  }
});

Vue.filter('dateAgo', function(value) {
  if (value) {
    return moment(value).fromNow()
  }
});



// GLOBAL COMPONENTS

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.min.css';

Vue.component('loading', Loading);

import Warning from './components/warning.vue'

Vue.component('warning', Warning);



// VUE + GLOBAL STORE

import App from './App.vue'
import InitialLoading from './InitialLoading.vue'

let app;

export let globalData = new Vue({
	el: '#initialLoading',
	render: h => h(InitialLoading),
	methods: {
		initMainVueInstance(){
			firebase.auth().onAuthStateChanged( user => {
				if (!app) {
					app = new Vue({
						el: '#app',
						render: h => h(App),
						router: router
					});
				}
			});
		},
		isAdmin(){
			const user = firebase.auth().currentUser;
			if(!user)
			{
				return false;
			}
			let admin;
			for(admin in this.administrators){
				if(admin === user.uid)
				{
					return true;
				}
			}
			return false;
		},
	},
	data: {
		blogPosts: undefined,
		administrators: undefined,
		token: null
	},
});
