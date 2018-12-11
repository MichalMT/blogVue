<template>
	<div id="app">
		<div class="container">

			<navbar></navbar>

			<keep-alive include="homePage">
				<transition name="fade">
					<router-view></router-view>
				</transition>
			</keep-alive>

		</div>
	</div>
</template>

<script>

	import navbar from './components/navbar.vue';

	export default {
		components: {
			"navbar": navbar,
		},
		name: 'app'
	}

</script>

<style lang="sass">

	$color1 : rgba(0,151,233,1)
	$color2 : #42b983

	#app
	  font-family: 'Avenir', Helvetica, Arial, sans-serif
	  color: #2c3e50

	body
		margin: 0
		-webkit-text-size-adjust: none

	body.gallery-open
		overflow: hidden

	.container
		max-width: 1000px
		margin: 0 auto

	h1, h2
	  font-weight: 900
	  text-transform: uppercase

	a
	  color: $color1

	p
		line-height: 30px

	button
		outline: none
		cursor: pointer

	.fade-enter
		opacity: 0

	.fade-enter-active
		// transition: opacity 1.4s
		transition: opacity .9s

	.fade-leave

	.fade-leave-active
		// transition: opacity .5s
		transition: opacity .1s
		opacity: 0

</style>
