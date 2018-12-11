<template>
    <div class="warning">

        <button class="closeBtn" @click="hide">&times;</button>
        <p>Post was not uploaded due to following reason(s) :</p>
        <ul>
            <li v-for="warning in warnings">{{ warning }}</li>
        </ul>

    </div>
</template>

<script>

    export default {
        name: "warning",
        props: ["warnings", "show"],
        methods: {
            hide(){
                this.$emit("hideWarning", false);
            }
        }
    }

</script>

<style lang="sass">

    .warning
        background: orange
        border-radius: 10px
        position: fixed
        top: 20px
        padding: 5px 20px
        width: calc(100% - 40px)
        max-width: 960px
        box-sizing: border-box
        color: white

    .closeBtn
        float: right
        display: inline
        width: 30px
        height: 30px
        border: solid 1px white
        color: white
        background: transparent
        padding: 0
        font-size: 1em
        border-radius: 10px
        margin-right: -14px

    ul
        list-style-type: none
        padding: 0

    li
        @media only screen and (max-width: 420px)
            text-align: left

</style>
