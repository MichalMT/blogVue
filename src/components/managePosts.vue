<template>
	<div id="adminContainer">

        <loading :active.sync="isLoading"></loading>

		<h3>Manage Blog Posts</h3>

		<div class="post" v-for="(post, id) in blogPosts">
			<h4>{{ post.title }}</h4>
			<p class="prev">{{ post.prev }}</p>
			<div class="info">
				<p class="active" v-if="post.published !== 'NO'">post is active</p>
				<p class="inactive" v-if="post.published === 'NO'">post is not active</p>
				<p class="date">created: {{ post.created | formatDate }} ({{ post.created | dateAgo }})</p>
				<p class="published" v-if="post.published !== 'NO' ">published: {{ post.published | formatDate }} ({{ post.published | dateAgo }})</p>
				<p class="author">author: {{ post.author.userName }}</p>
				<p class="category">category: {{ post.category.name }}</p>
			</div>
			<div class="actions">
				<button
					class="activate"
					@click='changeActiveState(post, id, {".sv": "timestamp"})'
					v-if="post.published === 'NO'"
				>
					Activate
				</button>
				<button
					class="deactivate"
					@click='changeActiveState(post, id, "NO")'
					v-if="post.published !== 'NO'"
				>
					Deactivate
				</button>
				<router-link :to="'/edit-post/'+post.id" class="edit">Edit</router-link>
				<button @click="deletePost(post)">Delete</button>
			</div>
			<div class="clear"></div>
		</div>
	</div>
</template>


<script>
	import { globalData } from "../main";

	export default {
	data(){
		return {
			blogPosts: undefined,
            isLoading: false
		}
	},
	created(){
        this.init();
	},
	methods: {
        init(){
            this.blogPosts = globalData.blogPosts;

            let reversedPosts = [];
            let i = Object.keys(this.blogPosts).length;

            for(let postId in this.blogPosts){
                i--;
                reversedPosts[i] = this.blogPosts[postId];
                reversedPosts[i].id = postId;
            }
            this.blogPosts = reversedPosts;
        },
		changeActiveState(post, id, published){
            this.isLoading = true;

			this.$http
				.patch(`posts/${post.id}.json`, {"published": published})
				.then(res => {
                        globalData.blogPosts[post.id].published = res.body.published;
                        this.init();
                        this.isLoading = false;
				})
				.catch(err => {
					console.log(err);
					alert("An error occured");
                    this.isLoading = false;
				})
		},
		deletePost(post){
            if( confirm("Delete this blog post ?\nAfter deleting post can NOT be recovered") )
            {
                this.isLoading = true;
                this.$http
                    .delete(`posts/${post.id}.json`)
                    .then(res => {
                        this.isLoading = false;
                        alert("Post was deleted. Site will be refreshed to applay this change.");
                        window.location.replace("/");
                    })
                    .catch(err => {
                        console.log(err);
    					alert("An error occured");
                        this.isLoading = false;
                    })
            }
		},
	}
}

</script>

<style lang="sass" scoped>

@import "../global"

#adminContainer
	width: 100%
	padding: 0 20px 20px
	box-sizing: border-box

.rl
	display: block
	width: 350px
	height: 35px
	padding: 0 20px
	box-sizing: border-box
	margin: 0 auto 15px
	border-radius: 10px

.add
	background: $colorSecondary1
	color: $colorPrimary1
	text-decoration: none
	font-weight: bold
	line-height: 35px

button, .edit
	font-size: 14px
	padding: 10px 10px
	border-radius: 10px
	color: white
	background: red
	cursor: pointer
	outline: none
	border: none

.activate
	background: limegreen

.deactivate
	background: orange

.edit
	background: $colorSecondary1
	text-decoration: none

.clear
	clear: both

.actions
	float: right
	margin-top: 5px

p.prev
	line-height: 24px
	max-height: 48px
	overflow: hidden

h4
	margin: 10px 0

.post
	padding: 20px
	box-shadow: 0 0 6px rgba($colorPrimary1, 0.5)
	background: rgba($lightGray, .3)
	margin: 20px 0
	border-radius: 10px

.date, .active, .inactive, .published, .author, .category
	display: inline
	border: solid 2px $colorSecondary1
	border-radius: 10px
	padding: 1px 10px
	font-size: 0.8em
	white-space: nowrap

.active
	border: solid 2px limegreen
	background: limegreen
	color: white

.inactive
	border: solid 2px orange
	background: orange
	color: white

</style>
