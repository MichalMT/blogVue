<template>
        <loading :active.sync="initialLoadingActive"></loading>
</template>

<script>

import firebase from "firebase";
import { globalData } from "./main";

export default {
    data(){
        return {
            initialLoadingActive: true,
        }
    },
    methods: {
        loadAdminsRef(){
            let promise = new Promise((resolve, reject) => {
                var administratorsRef = firebase.database().ref('administrators');
                administratorsRef.on('value', snapshot => {
                    globalData.administrators = snapshot.val();
                    resolve();
                });
            });
            return promise;
        },
        loadBlogPosts(){
            let promise = new Promise((resolve, reject) => {
                this.$http
                    .get("posts.json")
                    .then(res => {
                        globalData.blogPosts = res.body;
                        resolve();
                    })
                    .catch(err => reject(err))
            });
            return promise;
        },
        getToken(){
            let promise = new Promise((resolve, reject) => {
                firebase.auth().onIdTokenChanged(user => {
                    if(user)
                    {
                        user.getIdToken().then(idToken => {
                            globalData.token = idToken;
                            resolve();
                        })
                    }
                    else
                    {
                        globalData.token = null;
                        resolve();
                    }
                });
            });
            return promise;
        }
    },
    created(){
        this.getToken()
            .then(this.loadBlogPosts)
            .then(this.loadAdminsRef)
            .then(() => {
                this.initialLoadingActive = false;
                globalData.initMainVueInstance();
            })
    }
}
</script>

<style lang="css">
</style>
