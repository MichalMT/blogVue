<template>
	<div id="adminContainer">

        <loading :active.sync="isLoading"></loading>

		<h3>Administrators</h3>

        <user
            v-for="(user, id) in users"
            v-if="user.isAdmin"
            :user="user"
            :id="id"
            @addedAdminPrivileges="addAdminPrivileges($event)"
            @removedAdminPrivileges="removeAdminPrivileges($event)"
        >
        </user>

        <h3>Other Users</h3>

        <user
            v-for="(user, id) in users"
            v-if="!user.isAdmin"
            :user="user"
            :id="id"
            @addedAdminPrivileges="addAdminPrivileges($event)"
            @removedAdminPrivileges="removeAdminPrivileges($event)"
        >
        </user>

	</div>
</template>


<script>
	import { globalData } from "../main";
    import User from "./user.vue";
    import firebase from "firebase";

	export default {
        components: {
            "user": User
        },
    	data(){
    		return {
    			users: undefined,
                isLoading: true
    		}
    	},
    	created(){
            this.$http
                .get('users.json')
                .then(res => {
                    this.users = res.body;
                    console.log(this.users);

                    let user;
                    for(user in this.users){
                        if(this.hasAdminPrivileges(user))
                        {
                            this.users[user].isAdmin = true
                        }
                        else
                        {
                            this.users[user].isAdmin = false
                        }
                    }
                    console.log(this.users);

                    this.isLoading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.isLoading = false;

                })

    	},
    	methods: {
            hasAdminPrivileges(uid){
                let admin;
    			for(admin in globalData.administrators){
    				if(admin === uid)
    				{
    					return true;
    				}
    			}
                return false;
            },
            addAdminPrivileges(id){
                this.isLoading = true;
                this.$http
                    .patch("https://blog-vue-1.firebaseio.com/administrators.json", {
                        [id]: {
                            "authorized": {".sv":"timestamp"},
                            "autorizedBy": firebase.auth().currentUser.uid

                        }
                    })
                    .then(() => {
                        this.isLoading = false;
                        alert("Success");
                        this.$router.go(this.$router.currentRoute)
                    })
                    .catch(err => {
                        console.log(err);
                        alert("There was an unexpected error");
                        this.isLoading = false;
                    })
            },
            removeAdminPrivileges(id){
                this.isLoading = true;
                this.$http
                    .delete(`https://blog-vue-1.firebaseio.com/administrators/${id}.json`)
                    .then(() => {
                        this.isLoading = false;
                        alert("Success");
                        this.$router.go(this.$router.currentRoute)
                    })
                    .catch(err => {
                        console.log(err);
                        alert("There was an unexpected error");
                        this.isLoading = false;
                    })
            }
    	}
    }

</script>

<style lang="sass" scoped>

    @import "../global"

    #adminContainer
    	width: 100%
    	padding: 0 20px 20px
    	box-sizing: border-box

</style>
