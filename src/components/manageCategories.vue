<template>
    <div id="categoriesContainer">
        <loading :active.sync="isLoading"></loading>
        <h3>Manage Categories</h3>
        <h4>Current categories :</h4>
        <p v-for="cat in categories">{{ cat }}</p>
        <h4>Add new category</h4>
        <input type="text" name="" value="" placeholder="category name" v-model="newCategory">
        <button @click="addCategory">Add category</button>
        <p class="error" v-if="error !== null">{{ error }}</p>
    </div>
</template>

<script>

    import { globalData } from "../main";

    export default {
        beforeRouteEnter(to, from, next){
            if(globalData.isAdmin() === true)
            {
                next();
            }
            else
            {
                next(false);
            }
        },
        data(){
            return {
                categories: undefined,
                newCategory: undefined,
                isLoading: false,
                error: null
            }
        },
        created(){
            this.fetchCategories();
        },
        methods: {
            fetchCategories(){
                this.isLoading = true;
                this.$http
                    .get("categories.json")
                    .then(res => {
                        this.categories = res.body;
                        this.isLoading = false;
                    })
                    .catch(err =>{
                        console.log(err);
                        this.error = "There was an unexpected error.";
                        this.isLoading = false;
                    })
            },
            addCategory(){
                if(this.newCategory === undefined){
                    this.error = "Error. Name of new category can not be empty.";
                    return;
                }
                this.isLoading = true;
                this.$http
                    .post("categories.json", JSON.stringify(this.newCategory))
                    .then(res => {
                        this.fetchCategories();
                    })
                    .catch(err =>{
                        console.log(err);
                        this.error = "There was an unexpected error.";
                        this.isLoading = false;
                    })
            }
        }
    }
</script>

<style lang="sass" scoped>

    @import "../global"

    #categoriesContainer
    	width: 100%
    	padding: 0 20px 20px
    	box-sizing: border-box

    h3, h4, p
        text-align: center

    h3
    	margin: 10px 0

    p
        margin: 5px 0

    input
        border: solid 1px $colorPrimary1
        border-radius: 10px
        width: 300px
        margin: 0 auto
        height: 40px
        padding: 0 15px
        box-sizing: border-box
        display: block
        @media only screen and (max-width: 420px)
            width: 100%

    button
    	background: $colorPrimary1
    	color: white
    	text-decoration: none
    	display: block
    	width: 300px
    	height: 40px
    	margin: 15px auto 0
    	border-radius: 10px
    	@media only screen and (max-width: 420px)
    		width: 100%

    button:hover
    	color: $colorSecondary1

    .error
        color: white
        background: red
        padding: 10px
        border-radius: 10px

</style>
