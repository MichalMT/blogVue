<template>
	<div id="addPostContainer">

		<loading :active.sync="isLoading"></loading>

		<warning
			:warnings="warnings"
			:show="showWarning"
			@hideWarning="showWarning = $event"
			v-if="showWarning"
		>
		</warning>

		<h3>Add new blog post</h3>
		<p v-if="error" class="error">There was an unexpected error.</p>
		<p v-if="errorMsg">{{ errorMsg }}</p>
		<form v-if="!submitted && !error">

			<input type="text" v-model.lazy="blog.title" placeholder="Title" class="title" required />

			<textarea v-model.lazy.trim="blog.prev" placeholder="Preview Text" class="prev" required></textarea>

			<textarea v-model.lazy.trim="blog.text" placeholder="Blog Content" class="content" required></textarea>

			<select name="" id="categorySelect" v-model="blog.category.id" class="select">
				<option disabled value="">Select category</option>
				<option v-for="(cat,id) in categories" :value="id">{{cat}}</option>
			</select>

			<select v-model="blog.published" class="select">
				<option disabled value="undefined">Publish this post</option>
				<option :value='{".sv": "timestamp"}'>Now (post will be visible after uploading)</option>
				<option value="NO">Not now (post will not be visible yet)</option>
			</select>

			<button @click.prevent="selectMainImg">Add main image</button>
			<input
				type="file"
				class="imgInput"
				@change="mainImgSelected"
				style="display: none"
				ref="imgInput"
				accept="image/*"
			>
			<p v-if="mainImg">As main image is selected: {{ mainImg.name }}</p>
			<img v-if="this.mainImgPreview" :src="this.mainImgPreview">

			<button @click.prevent="selectGalleryImgs">Add images to gallery (optional)</button>
			<input
				type="file"
				class="galleryInput"
				@change="galleryImgsSelected"
				style="display: none"
				ref="galleryInput"
				accept="image/*"
				multiple="multiple"
			>
			<div class="gallery" v-for="imag in this.galleryImgs" v-if="galleryImgs[0]">
				<img :src="imag.preview">
				<p>gallery imgs selected: {{ imag.img.name }}</p>
				<textarea v-model="imag.description" placeholder="Add description to this image (optional)"></textarea>
			</div>

			<button v-on:click.prevent="upload" class="upload">Upload Blog Post</button>
		</form>

		<div v-if="submitted">
			<h4 class="success">Blog post was uploaded.</h4>
			<p>Updating page is required to see new post.</p>
			<a :href="'/post/'+blogID">Update and go to created post</a>
		</div>
	</div>
</template>

<script>

	import firebase from "firebase";

	export default {
		data(){
			return {
				blog: {
					title: "",
					prev: "",
					text: "",
					author: {
						uid: undefined,
						userName: undefined
					},
					created: {".sv": "timestamp"},
					category: {
						id: "",
						name: ""
					},
					published: undefined
				},
				submitted: false,
				error: false,
				errorMsg: undefined,
				categories: undefined,
				mainImg: null,
				mainImgPreview: null,
				blogID: undefined,
				mainImgUrl: undefined,
				mainImgUploaded: undefined,
				galleryImgs: [],
				galleryData: [],
				galleryUrls: [],
				isLoading: true,
				showWarning: false,
				warnings: [],
				includeGallery: false
			}
		},
		created(){
			this.$http
				.get("categories.json")
				.then(res => {
					this.categories = res.body;
					this.isLoading = false;
				})

		},
		methods: {
			upload(){
				this.validate()
					.then(this.uploadPost)
					.then(this.addToUser)
					.then(this.uploadImg)
					.then(this.addImgUrl)
					.then(this.uploadGallery)
					.then(this.addGalleryUrls)
					.then(() => {
						this.submitted = true;
						this.isLoading = false;
					})
					.catch(err => {
						console.log(err);
						if(err != "Validation failed.")
						{
							this.error = true;
						}
						this.isLoading = false;
					})
			},
			selectMainImg(){
				this.$refs.imgInput.click();
			},
			selectGalleryImgs(){
				this.$refs.galleryInput.click();
			},
			mainImgSelected(e){
				const fileReader = new FileReader();
				fileReader.addEventListener("load", () => {
					this.mainImgPreview = fileReader.result;
				})
				fileReader.readAsDataURL(e.target.files[0]);
				this.mainImg = e.target.files[0];
			},
			galleryImgsSelected(e){
				let self = this;
				for (let i = 0; i < e.target.files.length; i++) {
					let fileReader = new FileReader();
					let obj = {
						img: undefined,
						preview: undefined,
						description: ''
					};
					this.galleryImgs.push(obj);

					function loadPrev(){
						self.galleryImgs[i].preview = fileReader.result;
					}
					fileReader.addEventListener("load", loadPrev);

					fileReader.readAsDataURL(e.target.files[i]);
					this.galleryImgs[i].img = e.target.files[i];
				}
			},
			validate(){
				let promise = new Promise((resolve, reject) => {
					if(firebase.auth().currentUser == null)
					{
						this.errorMsg = "Try log out and log in again.";
						return reject("User is not logged in.");
					}

					this.blog.author.uid = firebase.auth().currentUser.uid;
					this.blog.author.userName = firebase.auth().currentUser.displayName;

					this.warnings = [];

					if(this.blog.title == ""){
						this.warnings.push("Title is required.");
					}
					if(this.blog.prev == ""){
						this.warnings.push("Preview text is required.");
					}
					if(this.blog.text == ""){
						this.warnings.push("Blog content is required.");
					}
					if(this.blog.category.id == "")
					{
						this.warnings.push("You need to select a category.");
					}
					if(this.blog.published === undefined)
					{
						this.warnings.push("You need to select when to publish this post.");
					}
					if(!this.mainImg)
					{
						this.warnings.push("You need to select main image.");
					}

					if(this.warnings.length > 0)
					{
						this.showWarning = true;
						return reject("Validation failed.");
					}

					if(this.galleryImgs.length > 0)
					{
						this.includeGallery = true;
					}
					return resolve("VAL compl");
				})
				return promise;
			},
			uploadPost(){
				let promise = new Promise((resolve, reject) => {
					this.isLoading = true;
					this.blog.category.name = this.categories[this.blog.category.id];
					this.$http
						.post('posts.json', this.blog)
						.then(res => {
							this.blogID = res.body.name;
							return resolve();
						})
						.catch(err => {
							console.log(err);
							reject(err);
						})
				})
				return promise;
			},
			addToUser(){
				return new Promise((resolve, reject) => {
					this.$http
						.post(`users/${this.blog.author.uid}/createdPosts.json`, JSON.stringify(this.blogID))
						.then(() => resolve())
						.catch(err => reject(err))
				});
			},
			uploadImg(){
				return new Promise((resolve, reject) => {
					const imgName = this.mainImg.name;
					const imgExt = imgName.slice(imgName.lastIndexOf("."));
					firebase.storage()
							.ref(this.blogID + "/main" + imgExt).put(this.mainImg)
							.then(res => {
								this.mainImgUrl = res.metadata.downloadURLs[0];
								resolve();
							})
							.catch(err => reject(err))
				})
			},
			addImgUrl(){
				return new Promise((resolve, reject) => {
					this.$http
						.patch(`posts/${this.blogID}.json`, {
							"mainImgUrl": this.mainImgUrl
						})
						.then(() => resolve())
						.catch(err => reject(err))
				})
			},
			uploadGallery(){
				return new Promise((resolve, reject) => {
					if(!this.includeGallery)
					{
						return resolve();
					}
					let imgName;
					let imgExt;
					for (var i = 0; i < this.galleryImgs.length; i++) {
						imgName = this.galleryImgs[i].img.name;
						imgExt = imgName.slice(imgName.lastIndexOf("."));

						firebase.storage()
								.ref(this.blogID + "/" + i + imgExt).put(this.galleryImgs[i].img)
								.then(res => {
									this.galleryUrls.push(res.metadata.downloadURLs[0]);
									if(this.galleryUrls.length == this.galleryImgs.length)
									{
										resolve();
									}
								})
								.catch(err => {
									reject(err);
								})
					}
				})
			},
			addGalleryUrls(){
				return new Promise((resolve, reject) => {
					if(!this.includeGallery)
					{
						return resolve();
					}
					for (var i = 0; i < this.galleryUrls.length; i++) {
						this.galleryData.push({
							"url": this.galleryUrls[i],
							"description": this.galleryImgs[i].description
						})
					}

					this.$http
						.patch(`posts/${this.blogID}.json`, {
							"gallery": this.galleryData
						})
						.then(() => resolve())
						.catch(err => reject(err))
				})
			}
		}
	}
</script>

<style lang="sass" scoped>

	@import "../global"

	#addPostContainer
		width: 100%
		padding: 0 20px 20px
		box-sizing: border-box
		text-align: center

	.title, .prev, .content, select, button, .imgInput, textarea
		width: 100%
		border: solid 1px $colorPrimary1
		border-radius: 5px
		padding: 10px 20px
		box-sizing: border-box
		margin: 15px 0 0

	select
		height: 35px

	.prev
		height: 80px

	.content
		height: 250px

	button
		background: $colorPrimary1
		color: white
		cursor: pointer

	img
		max-height: 80px
		width: auto

	.gallery
		text-align: left
		margin-bottom: 35px

	.gallery img
		width: 20%
		height: auto
		float: left
		margin: 0 15px 0 0

	.gallery textarea
		width: calc(80% - 15px)
		margin: 0

	.success
		background: limegreen
		color: white
		padding: 15px
		border-radius: 10px

	.error
		color: white
		background: red
		padding: 10px
		border-radius: 10px

</style>
