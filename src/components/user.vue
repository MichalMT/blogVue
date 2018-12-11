<template>
    <div class="user">

        <h4>{{ user.userName }}</h4>
        <p class="prev">UID: {{ id }}</p>

        <div class="info">
            <p class="active" v-if="user.isAdmin">user has admin privileges</p>
            <p class="meta">registered: {{ user.registered | formatDate }} ({{ user.registered | dateAgo }})</p>
            <p class="meta">created posts: {{ user.createdPosts ? Object.keys(user.createdPosts).length : 0 }}</p>
        </div>

        <div class="actions">
            <button
                class="activate"
                @click='addAdminPrivileges(id)'
                v-if="!user.isAdmin"
            >
                Add admin privileges
            </button>
            <button
                class="delete"
                @click='removeAdminPrivileges(id)'
                v-if="user.isAdmin"
            >
                Remove admin privileges
            </button>
        </div>
        
        <div class="clear"></div>

    </div>
</template>

<script>

    export default {
        props: ["user", "id"],
        methods: {
            addAdminPrivileges(id){
                this.$emit('addedAdminPrivileges', id)
            },
            removeAdminPrivileges(id){
                this.$emit('removedAdminPrivileges', id)
            }
        }
    }

</script>

<style lang="sass" scoped>

    @import "../global"

    button
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

    .user
    	padding: 20px
    	box-shadow: 0 0 6px rgba($colorPrimary1, 0.5)
    	background: rgba($lightGray, .3)
    	margin: 20px 0
    	border-radius: 10px

    .meta, .active
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

</style>
