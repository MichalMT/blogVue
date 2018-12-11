<template>
		<div class="postContainer">

			<warning
				:warnings="warnings"
				:show="showWarning"
				@hideWarning="showWarning = $event"
				v-if="showWarning"
			>
			</warning>

			<p v-if="error" class="error">There was an unexpected error.</p>
			<p v-if="errorMsg">{{ errorMsg }}</p>

			<div class="wrap">
				<h4>Post Title</h4>
				<h2 contenteditable="true" class="title" ref="title">{{ post.title }}</h2>
			</div>

			<div class="wrap">
				<h4>Post Preview</h4>
				<p contenteditable="true" class="text prev" ref="prev">{{ post.prev }}</p>
			</div>

			<div class="wrap">
				<h4>Post Text</h4>
				<p contenteditable="true" class="text content" ref="content">{{ post.text }}</p>
			</div>

			<button
				class="save"
				@click='saveChanges(post, id, {".sv": "timestamp"})'
			>
				Save changes
			</button>

			<router-link class="revert" to="/manage-posts/">
				Revert changes
			</router-link>

			<div v-if="updated">
				<h4 class="success">Blog post was updated.</h4>
			</div>

			<comments :id="id" :add="false"></comments>
		</div>
</template>

<script>

	import firebase from "firebase";
	import { globalData } from "../main";
	import comments from './comments.vue';
	import gallery from './gallery.vue';

	export default {
		components: {
			"comments": comments,
			"gallery": gallery
		},
		data(){
			return {
	            id: this.$route.params.id,
	            posts: globalData.blogPosts,
	            post: undefined,
				warnings: [],
				showWarning: false,
				error: false,
				errorMsg: undefined,
				updated: false
			}
		},
		created(){
			this.isLoading = true;
			if(globalData.blogPosts)
			{
	        	this.post = this.posts[this.id];
			}
			else
			{
				this.$http
					.get(`posts/${this.id}.json`)
					.then(res => {
						this.post = res.body;
					})
			}
		},
		methods: {
			saveChanges(post, id, timestamp){
				this.validate()
					.then(this.uploadPost)
					.then(() => {
						this.updated = true;
					})
					.catch(err => {
						if(err == "Validation failed.")
						{
							this.showWarning = true;
						}
						else
						{
							console.log(err);
							this.error = true;
						}
					})
			},
			validate(){
				return new Promise((resolve, reject) => {
					if(firebase.auth().currentUser == null)
					{
						this.errorMsg = "Try log out and log in again.";
						return reject("User is not logged in.");
					}

					this.warnings = [];

					this.post.title = this.$refs.title.innerHTML;
					this.post.prev = this.$refs.prev.innerHTML;
					this.post.text = this.$refs.content.innerHTML;

					if(this.post.title == ""){
						this.warnings.push("Title is required.");
					}
					if(this.post.prev == ""){
						this.warnings.push("Preview text is required.");
					}
					if(this.post.text == ""){
						this.warnings.push("Blog content is required.");
					}

					if(this.warnings.length > 0)
					{
						this.showWarning = true;
						return reject("Validation failed.");
					}
					else
					{
						return resolve("VAL compl");
					}
				})
			},
			uploadPost(){
				return new Promise((resolve, reject) => {
					this.isLoading = true;

					this.$http
						.patch(`posts/${this.id}.json`, {
							"title": this.post.title,
							"prev": this.post.prev,
							"text": this.post.text
						})
						.then(res => {
							return resolve();
						})
						.catch(err => {
							console.log(err);
							reject(err);
						})
				})
			},
			revertChanges(){
				this.$router.push("/edit-post/"+this.id);
			}
		}
	}

</script>

<style lang="sass" scoped>

	@import "../global"

	.postContainer
		width: 100%
		padding: 0 20px 25px
		box-sizing: border-box

	a
		text-decoration: none
		color: #444

	a:hover
		color: rgba(0,151,233,1)

	.s
		width: 100%
		margin: 0
		background: #999
		border-radius: 10px

	.s1
		height: 200px

	h2
		padding: 0 5px
		margin: 20px 0 15px
		text-transform: uppercase
		font-weight: 900

	p
		padding: 0 5px
		margin: 5px 0 5px
		text-align: justify

	.text
		white-space: pre-line
		margin-top: 25px

	.metadata
		display: inline
		border: solid 2px $colorSecondary1
		border-radius: 10px
		padding: 1px 10px
		font-size: 0.8em
		white-space: nowrap

	[contenteditable="true"]
		cursor: pointer

	[contenteditable="true"]:focus
		cursor: auto
		color: $colorSecondary1

	button, routerLink, .revert
		font-size: 14px
		padding: 10px 10px
		// float: right
		border-radius: 10px
		color: white
		background: red
		cursor: pointer
		outline: none
		border: none

	.save
		background: limegreen

	router-link:hover
		color: white

	h4
		margin: 0px

	.wrap
		border: solid 1px $colorPrimary1
		border-radius: 10px
		margin-bottom: 35px
		padding: 25px

	.success
		background: limegreen
		color: white
		padding: 15px
		border-radius: 10px
		margin-top: 20px

	.error
		color: white
		background: red
		padding: 10px
		border-radius: 10px

</style>
