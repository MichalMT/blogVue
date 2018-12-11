<template>
	<div id="registerContainer">

		<loading :active.sync="isLoading"></loading>

		<h3>Register</h3>
		<p v-if="userNameExists" class="error">This User Name alredy exists. Please try again.</p>
		<p v-if="success" class="success">User was registered successfully.</p>
		<router-link v-if="success" class="btn" to="/login">Log In</router-link>
		<p v-if="error !=='' " class="error">{{ error }}</p>
		<form v-if="!success">
			<label>User Name:</label>
			<input type="text" v-model="userName" required>
			<label>Email:</label>
			<input type="email" v-model="email" required>
			<label>Password:</label>
			<input type="password" v-model="password" required>
			<button v-on:click.prevent="register">Register</button>
		</form>

	</div>
</template>

<script>

	import firebase from "firebase"

	export default {
		data(){
			return {
				userName: "",
				email: "",
				password: "",
				userNameExists: false,
				success: false,
				error: "",
				isLoading: false
			}
		},
		methods: {
			register(){
				this.validate()
					.then(this.registerUser)
					.then(uid => this.createUser(uid))
					.then(this.reserveUserName)
					.then(() => {
						this.userName = "";
						this.email = "";
						this.password = "";
						this.success = true;
						this.error = "";
						firebase
							.auth()
							.signOut()
					})
					.then(() => {
						this.isLoading = false;
					})
					.catch(err => {
						console.log(err);
						this.isLoading = false;
					})
			},
			validate(){
				return new Promise((resolve, reject) => {
					this.isLoading = true;
					if(this.userName == "" || this.email == "" || this.password == "")
					{
						this.error = "All fields are required.";
						return reject("Validation failed. Required field is empty.");
					}
					// check if user name exists
					this.$http
					    .get("userNames.json")
						.then(res => {
							for(let userName in res.body){
								if( res.body[userName].toUpperCase() == this.userName.toUpperCase() )
								{
									this.userNameExists = true;
									return reject("Validation failed. This user name already exists.");
								}
							}
							resolve();
						})
						.catch(err => {
							this.error = "There was an error. ";
							reject(err);
						})
				})
			},
			registerUser(){
				return new Promise((resolve, reject) => {
					firebase
						.auth()
						.createUserWithEmailAndPassword(this.email, this.password)
						.then(user => {
							user.updateProfile({
								displayName: this.userName,
							})
							resolve(user.uid);
						})
						.catch(err => {
							this.error = err.message;
							reject(err);
						})
				})
			},
			createUser(uid){
				return new Promise((resolve, reject) => {
					let userObj = { [uid] : {
						"userName": this.userName,
						"registered": {".sv": "timestamp"}
					}};
					this.$http
						.patch("users.json", userObj)
						.then(() => resolve())
						.catch(err => {
							this.error = "There was an error. ";
							reject(err);
						})
				})
			},
			reserveUserName(){
				return new Promise((resolve, reject) => {
					this.$http
						.post("userNames.json", JSON.stringify(this.userName))
						.then(() => {
							resolve();
						})
						.catch(err => reject(err))
				})
			}
		}
	}

</script>

<style lang="sass" scoped>

	@import "../global"

	#registerContainer
		width: 100%
		padding: 0 20px 20px
		text-align: center
		box-sizing: border-box

	input, button, .btn
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

	button, .btn
		background: $colorPrimary1
		color: white
		text-decoration: none
		font-size: 14px
		line-height: 30px

	.error
		color: red
		font-weight: bold

	.success
		color: limegreen
		font-weight: bold

</style>
