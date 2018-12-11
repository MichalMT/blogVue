import allPosts         from './components/allPosts.vue';
import blogPost         from './components/blogPost.vue';
import editPost         from './components/editPost.vue';
import addPost          from './components/addPost.vue';
import login            from './components/login.vue';
import register         from './components/register.vue';
import admin            from './components/admin.vue';
import managePosts      from './components/managePosts.vue';
import manageCategories from './components/manageCategories.vue';
import manageUsers      from './components/manageUsers.vue';

import { globalData }   from './main.js';

const requireAdminAuth = (to, from, next) => {
    if(globalData.isAdmin())
    {
        next();
    }
    else
    {
        next("/login");
    }
}

export default [
    {
        path: '/posts/:cat',
        component: allPosts
    },
    {
        path: '/post/:id',
        component: blogPost
    },
    {
        path: '/edit-post/:id',
        component: editPost,
        beforeEnter: requireAdminAuth
    },
	{
        path: '/addPost',
        component: addPost,
        beforeEnter: requireAdminAuth
    },
	{
        path: '/login',
        component: login
    },
	{
        path: '/register',
        component: register
    },
    {
        path: '/admin',
        component: admin,
        beforeEnter: requireAdminAuth
    },
    {
        path: '/manage-posts',
        component: managePosts,
        beforeEnter: requireAdminAuth
    },
    {
        path: '/manage-categories',
        component: manageCategories,
        beforeEnter: requireAdminAuth
    },
    {
        path: '/manage-users',
        component: manageUsers,
        beforeEnter: requireAdminAuth
    },
    {
        path: '*',
        redirect: '/posts/all'
    }
]
