<template>
	<div id="loginContainer">

		<h3>Log In</h3>
		<form>
			<label>Email</label>
			<input type="email" v-model="email" required>
			<label>Password</label>
			<input type="password" v-model="password" required>
			<button v-on:click.prevent="logIn">Log In</button>
		</form>

		<h3>Dont have an account?</h3>
		<router-link to="/register" class="rl register">Register</router-link>
	</div>
</template>

<script>

	import firebase from "firebase"

	export default {
		data(){
			return {
				email: "test@user1.sk",
				password: "123456"
			}
		},
		methods: {
			logIn(){
				firebase
					.auth()
					.signInWithEmailAndPassword(this.email, this.password)
					.then(user => {
						this.$router.push("/");
					})
					.catch(e => {
						console.log(e.message)
					});
			}
		}
	}
</script>

<style lang="sass" scoped>

	@import "../global"

	#loginContainer
		text-align: center
		width: 100%
		padding: 0 20px 25px
		box-sizing: border-box

	input, button, .register
		display: block
		width: 360px
		height: 35px
		padding: 0 20px
		box-sizing: border-box
		margin: 0 auto 15px
		border-radius: 10px
		border: solid 1px $colorPrimary1
		background: white
		@media only screen and (max-width: 420px)
			width: 100%

	button, .register
		background: $colorPrimary1
		color: white
		text-decoration: none
		font-size: 14px
		line-height: 30px

	button
		margin-bottom: 40px

</style>
