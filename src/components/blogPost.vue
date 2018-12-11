<template>
		<div class="postContainer">
			<img :src="post.mainImgUrl" class="s" alt="">

			<h2>{{ post.title }}</h2>

			<p class="metadata">published: {{ post.published | formatDate }}</p>
			<p class="metadata">author: {{ post.author.userName }}</p>
			<p class="metadata">category: {{ post.category.name }}</p>

			<p class="text">{{ post.text }}</p>

			<gallery :post="post" v-if="post.gallery"></gallery>

			<comments :id="id"></comments>
		</div>
</template>

<script>

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
		border-radius: 10px
		border: none

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

</style>
