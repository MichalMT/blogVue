<template>
	<div class="allPosts">

		<loading :active.sync="isLoading"></loading>

		<div class="post" v-for="(post, id) in blogPosts" v-if="post.published !== 'NO' ">
			<router-link :to="'/post/'+post.id">
				<div class="s s1" :style="{backgroundImage:'url('+post.mainImgUrl+')'}"></div>
				<h3>{{ post.title }}</h3>
				<p>{{ post.prev }}</p>
				<p class="date">published {{ post.published | dateAgo }}</p>
			</router-link>
		</div>

	</div>
</template>

<script>

	import firebase from "firebase";
	import { globalData } from "../main";

	export default {
		name: "homePage",
		data(){
			return {
				blogPosts: undefined,
				catParam: undefined,
				isLoading: false
			}
		},
		watch: {
			'$route.params.cat'() {
				this.filterCategories(this.$route.params.cat);
				this.order();
			}
		},
		created(){
			if(this.$route.params.cat)
			{
				this.filterCategories(this.$route.params.cat);
			}
			this.order();
		},
		methods: {
			filterCategories(cat){
				this.blogPosts = globalData.blogPosts;
				if(cat != "all")
				{
					let filtredPosts = {};
					for(let blog in this.blogPosts){
						if(this.blogPosts[blog].category.id == cat)
						{
							filtredPosts[blog] = this.blogPosts[blog]
						}
					}
					this.blogPosts = filtredPosts;
				}
			},
			order(){
	            let reversedPosts = [];
	            let i = Object.keys(this.blogPosts).length;

	            for(let postId in this.blogPosts){
	                i--;
	                reversedPosts[i] = this.blogPosts[postId];
	                reversedPosts[i].id = postId;
	            }
	            this.blogPosts = reversedPosts;
	        },
		}
	}
</script>

<style lang="sass" scoped>

	@import "../global"

	.post
		width: 50%
		padding: 0 20px 45px
		box-sizing: border-box
		float: left
		@media only screen and (max-width: 640px)
			width: 100%

	a
		text-decoration: none
		color: #444

	a:hover
		color: rgba(0,151,233,1)

	.s
		width: 100%
		margin: 0
		border-radius: 10px
		background-size: cover
		background-position: center center
		box-sizing: border-box

	.s1
		height: 100px

	h3
		padding: 0 5px
		margin: 10px 0 5px
		text-transform: uppercase
		font-weight: 900

	p
		padding: 0 5px
		margin: 5px 0 5px
		text-align: justify
		line-height: 27px

	.date
		display: inline
		border: solid 2px $colorSecondary1
		border-radius: 10px
		padding: 1px 10px
		font-size: 0.8em

</style>
