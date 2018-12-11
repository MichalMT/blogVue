<template>
	<div id="navbar">
		<div id="navbarContent">
			<router-link to="/" id="blogName" class="rl">Blog name</router-link>

			<img
				:src="usrIcon"
				class="userIcon"
				v-on:mouseenter="fadeInUserDropdown"
				v-on:mouseleave="fadeOutUserDropdown"
				v-on:touchstart="touchFadeUserDropdown"
			>
			<img
				:src="catIcon"
				class="categoryIcon"
				v-on:mouseenter="fadeInCategoryDropdown"
				v-on:mouseleave="fadeOutCategoryDropdown"
				v-on:touchstart="touchFadeCategoryDropdown"
			>

			<transition name="fadeO">
				<div class="userDropdown" ref="userDropdown" v-on:mouseenter="fadeInUserDropdown" v-on:mouseleave="fadeOutUserDropdown" v-if="userDropdownActive && !categoryDropdownActive">
					<div class="udf"></div>
					<div class="userDropdownContent">
						<p v-if="!loggedIn">You are not logged in</p>
						<router-link v-if="!loggedIn" class="btn" v-on:click.native="fadeOutUserDropdown" to="/login">Log In</router-link>
						<router-link v-if="!loggedIn" class="btn" v-on:click.native="fadeOutUserDropdown" to="/register">Register</router-link>

						<p v-if="loggedIn">You are logged in as :<br>{{ userName }}</p>
						<router-link v-if="isAdmin && loggedIn" to="/admin" class="btn" v-on:click.native="fadeOutUserDropdown">Admin area</router-link>
						<button v-if="loggedIn" @click="logOut" class="btn" v-on:click.native="fadeOutUserDropdown">Log Out</button>

					</div>
					<div class="clear"></div>
				</div>
			</transition>

			<transition name="fadeG">
				<div class="categoryDropdown" ref="categoryDropdown" v-on:mouseenter="fadeInCategoryDropdown" v-on:mouseleave="fadeOutCategoryDropdown" v-if="categoryDropdownActive && !userDropdownActive">
					<div class="udf"></div>
					<div class="categoryDropdownContent">
						<form>
							<input type="radio" id="catAll" name="category" v-model="selectedCat" @change="changeCat" value="all" checked>
							<label for="catAll">All categories</label>
							<fieldset v-for="(cat,id) in categories">
								<input type="radio" :id="id" name="category" v-model="selectedCat" @change="changeCat" :value="id">
								<label :for="id">{{ cat }}</label>
							</fieldset>
						</form>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>

<script>

	import firebase from "firebase";
	import { globalData } from "../main";

	export default {
		data(){
			return {
				loggedIn: false,
				isAdmin: false,
				userName: null,
				selectedCat: null,
				userDropdownActive: false,
				categoryDropdownActive: false,
				catIcon: "/cat2.png",
				usrIcon: "/usr3.png",
				categories: undefined
			}
		},
		watch:{
			$route (to, from){
				this.selectedCat = this.$route.params.cat;
			}
		},
		created(){
			this.$http
				.get("categories.json")
				.then(res => {
					this.categories = res.body;
				})
				.catch(err => {
					console.log(err);
				})
			this.selectedCat = this.$route.params.cat;

			this.auth();
		},
		methods: {
			auth(){
				firebase.auth().onAuthStateChanged( user => {
					let currentUser = firebase.auth().currentUser;
					if( currentUser )
					{
						this.userName = currentUser.displayName;
						this.loggedIn = true;
					}
					else
					{
						this.userName = null;
						this.loggedIn = false;
					}

					if(globalData.isAdmin() === true)
					{
						this.isAdmin = true;
					}
					else
					{
						this.isAdmin = false;
					}
				});
			},
			logOut() {
				firebase
					.auth()
					.signOut()
			},
			fadeInUserDropdown() {
				this.userDropdownActive = true;
				this.usrIcon = "/usr4.png"
			},
			fadeOutUserDropdown() {
				this.userDropdownActive = false;
				this.usrIcon = "/usr3.png";
			},
			touchFadeUserDropdown(){
				if(!this.userDropdownActive)
				{
					this.fadeInUserDropdown();
				}
				else
				{
					this.fadeOutUserDropdown();
				}
			},
			fadeInCategoryDropdown() {
				this.categoryDropdownActive = true;
				this.catIcon = "/cat1hover.png";
			},
			fadeOutCategoryDropdown() {
				this.categoryDropdownActive = false;
				this.catIcon = "/cat2.png";
			},
			touchFadeCategoryDropdown(){
				if(!this.categoryDropdownActive)
				{
					this.fadeInCategoryDropdown();
				}
				else
				{
					this.fadeOutCategoryDropdown();
				}
			},
			changeCat(){
				this.$router.push("/posts/"+this.selectedCat);
				this.fadeOutCategoryDropdown();
			}
		}
	}

</script>

<style lang="sass" scoped>

	@import "../global"

	#navbar
		width: 100%

	#navbarContent
		margin: 20px
		height: 50px
		background: $colorPrimary1
		color: white
		border-radius: 10px
		padding: 0 10px

	fieldset
		border: 0
		padding: 0
		margin: 10px 0 0px

	.rl
		height: 30px
		line-height: 30px
		float: right
		text-transform: uppercase
		font-size: 16px
		margin: 0
		padding: 10px
		text-decoration: none

	.btn
		color: $colorSecondary1
		border: solid 1px $colorSecondary1
		border-radius: 10px
		text-decoration: none
		padding: 5px 0
		display: block
		margin-top: 10px
		background: $colorPrimary1
		font-size: 1em
		cursor: pointer
		width: 100%
		transition: color .3s, background .5s

	.btn:hover, label:hover
		background: $colorSecondary1
		color: $colorPrimary1

	input[type="radio"]
		position: absolute
		display: none

	label
		color: $colorSecondary1
		border: solid 1px $colorSecondary1
		border-radius: 10px
		padding: 5px 10px
		display: block
		margin: 0
		background: $colorPrimary1
		font-size: 1em
		cursor: pointer
		text-align: center
		transition: color .3s, background .5s

	input[type="radio"]:checked+label
		background: $colorSecondary1
		color: $colorPrimary1

	#blogName
		font-size: 20px
		font-weight: 900
		letter-spacing: 1px
		float: left

	.userIcon
		height: 30px
		width: 30px
		color: white
		float: right
		margin: 0
		padding: 10px

	.categoryIcon
		height: 30px
		width: 30px
		color: white
		margin: 0
		padding: 10px
		float: right

	.userDropdown, .categoryDropdown
		float: right
		position: relative
		right: -110px
		top: 50px
		width: 360px
		background: red
		@media only screen and (max-width: 1000px)
			// top: 0
			// right: -10px
			top: 50px
			right: -110px
		@media only screen and (max-width: 673px)
			top: 0
			right: -10px
			// top: 50px
			// right: -110px

	.udf
		position: absolute
		height: 15px
		width: 360px

	.userDropdownContent, .categoryDropdownContent
		margin-top: 15px
		background: $colorPrimary1
		color: white
		border-radius: 10px
		padding: 20px
		text-align: center
		position: absolute
		top: 0
		right: 0
		width: 320px
		box-shadow: 0 2px 6px $colorPrimary1
		@media only screen and (max-width: 420px)
			width: calc(100vw - 80px)

	.userDropdownContent::before
		content: ""
		width: 0
		height: 0
		border-left: 15px solid transparent
		border-right: 15px solid transparent
		border-bottom: 12px solid $colorPrimary1
		position: absolute
		top: -12px
		right: 20px

	.categoryDropdownContent::before
		content: ""
		width: 0
		height: 0
		border-left: 15px solid transparent
		border-right: 15px solid transparent
		border-bottom: 12px solid $colorPrimary1
		position: absolute
		top: -12px
		right: 70px

	.userDropdownContent p
		margin-top: 0

	form
		text-align: left

	form input
		margin: 0px
		padding: 0

	.clear
		clear: both

	.fadeO-enter-active, .fadeG-enter-active
	    transition: opacity .5s

	.fadeO-enter, .fadeO-leave-to
	    opacity: 0

	.fadeO-enter-to, .fadeO-leave
	    opacity: 1

	.fadeG-leave-active, .fadeO-leave-active
	    transition: opacity .5s

	.fadeG-enter, .fadeG-leave-to
	    opacity: 0

	.fadeG-enter-to, .fadeG-leave
	    opacity: 1

</style>
