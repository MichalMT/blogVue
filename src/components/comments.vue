<template>
    <div id="comments">
        <h2>Comments</h2>

        <p v-if="!comments" class="info">no comments yet</p>

        <div class="comment" v-for="(comment, id) in comments">

            <div class="info">
                <p>{{ comment.created | dateAgo }} by user : {{ comment.author.userName }}
                    <button v-if="add === false && user" @click="deleteComment(id)" class="delete">x</button>
                </p>
            </div>

            <p class="text">{{ comment.text }}</p>
        </div>

        <div class="logIn" v-if="!user  && add !== false">
            <h3>Add new comment</h3>
            <p>You need to be registered</p>
            <div class="links">
                <router-link to="/login" class="link">Log In</router-link>
                <router-link to="/register" class="link">Register</router-link>
            </div>
        </div>
        <div class="addComment" v-if="user && add !== false">
            <h3>Add new comment</h3>
            <form>
                <textarea v-model="newComment.text"></textarea>
                <button v-on:click.prevent="uploadComment" class="upload">Add Comment</button>
            </form>
        </div>
    </div>
</template>

<script>

    import firebase from "firebase";

    export default {
        props: ["id", "add"],
        data(){
            return {
                comments: null,
                user: null,
                input: "",
                newComment: {
                    text: "",
                    author: {
                        uid: null,
                        userName: null
                    },
                    created: {".sv": "timestamp"},
                }
            }
        },
        created(){
            this.user = firebase.auth().currentUser;

            var commentsRef = firebase.database().ref('comments/' + this.id );
            commentsRef.on('value', snapshot => {
                this.comments = snapshot.val();
            });
        },
        methods: {
            uploadComment(){
                this.newComment.author.uid = this.user.uid;
                this.newComment.author.userName = this.user.displayName;
                this.$http
                    .post(`comments/${this.id}.json`, this.newComment)
                    .then(res => {
                        this.newComment.text = "";
                        this.newComment.author.uid = null;
                        this.newComment.author.userName = null;

                        let comments = document.querySelectorAll(".comment");
                        let lastComment = comments[comments.length-1];
                        window.scrollBy(0, lastComment.clientHeight);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            deleteComment(id){
                if(confirm("Delete this comment ?"))
                {
                    this.$http
                        .delete(`comments/${this.id}/${id}.json`)
                        .catch(err => {
                            console.log(err);
                            alert("There was an unexpected error.")
                        })
                }
            }
        }
    }
</script>

<style lang="sass" scoped>

    @import "../global"

    .info, h3
        border-radius: 10px
        background: #333
        color: white

    .info
        height: 30px
        font-size: 15px

    h3
        padding: 5px 15px

    p
        margin: 0
        padding: 0px 15px
        line-height: 30px

    .text
        padding: 5px 15px 25px
        text-align: justify

    textarea
        width: 80%
        height: 52px
        border-radius: 10px
        padding: 10px
        box-sizing: border-box
        @media only screen and (max-width: 413px)
            width: 100%

    button
        width: 18%
        height: 52px
        border-radius: 10px
        color: white
        background: $colorPrimary1
        cursor: pointer
        border: none
        float: right
        margin: 0
        @media only screen and (max-width: 413px)
            width: 100%
            height: 30px

    button.delete
        width: 21px
        height: 21px
        margin-top: 4px
        background: red

    .logIn
        border: solid 1px $colorPrimary1
        border-radius: 10px
        margin-top: 20px

    .logIn h3
        margin: -1px
        border-bottom-left-radius: 0
        border-bottom-right-radius: 0

    .logIn p
        display: inline-block
        padding: 25px 15px 25px
        @media only screen and (max-width: 430px)
            display: block
            text-align: center

    .link
        text-decoration: none
        background: $colorPrimary1
        color: white
        border-radius: 10px
        padding: 5px 12px
        @media only screen and (max-width: 430px)
            width: 85px

    .link:hover
        background: $colorSecondary1

    .info
        background: $colorSecondary1

    .links
        display: inline
        @media only screen and (max-width: 430px)
            display: block
            width: 160px
            margin: 0 auto 20px

    h2
        padding: 30px 0 20px

</style>
