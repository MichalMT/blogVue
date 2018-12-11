<template>
	<div id="adminContainer">

		<h3>Admin area</h3>

		<router-link to="/addPost" class="btn">Add post</router-link>
		<p>Create new blog post</p>

		<router-link to="/manage-posts" class="btn">Manage posts</router-link>
		<p>Delete blog post(s), activate unpublished post or deactivate published post</p>

		<router-link to="/manage-categories" class="btn">Manage categories</router-link>
		<p>See current categories or create a new one</p>

		<router-link to="/manage-users" class="btn">Manage users</router-link>
		<p>See all users and manage administrator privileges</p>

	</div>
</template>


<script>

</script>

<style lang="sass" scoped>

	@import "../global"

	#adminContainer
		width: 100%
		padding: 0 20px 20px
		box-sizing: border-box
		text-align: center

	.add
		background: $colorSecondary1
		color: $colorPrimary1
		text-decoration: none
		font-weight: bold
		line-height: 35px

	h3
		text-transform: uppercase

	.btn
		background: $colorPrimary1
		color: white
		text-decoration: none
		display: block
		width: 260px
		padding: 6px 20px
		box-sizing: border-box
		margin: 35px auto 0
		border-radius: 10px
		@media only screen and (max-width: 420px)
			width: 100%

	.btn:hover
		color: $colorSecondary1

	p
		margin-top: 8px

</style>
