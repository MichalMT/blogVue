<template>
    <div id="gallery">

        <h2>Gallery</h2>

        <img
            v-for="(img, index) in post.gallery"
            :src="img.url"
            class="img"
            alt="Click to open in full-screen"
            @click="open(index)"
        >
        <div class="clear"></div>

        <transition name="fadeO">
            <div class="overlay" ref="galleryOverlay" v-if="galleryActive"></div>
        </transition>

        <transition name="fadeG">
            <div class="fullScreen" ref="gallery" v-if="galleryActive">
                <div class="top" v-if="numberOfImgs > 1">
                    <button class="btn prevBtn" ref="prevImg" @click="prevImg">&laquo;</button>
                    <p class="number">{{ selectedImgIndex + 1 }} of {{ numberOfImgs }}</p>
                    <button class="btn nextBtn" ref="nextImg" @click="nextImg">&raquo;</button>
                </div>
                <button class="btn closeBtn" ref="closeGallery" @click="close">&times;</button>
                <img
                    :src="selectedImg.url"
                    class="imgFullScreen"
                >
                <p class="description">{{ selectedImg.description }}</p>
            </div>
        </transition>

    </div>
</template>

<script>

    export default {
        props: ["post"],
        data(){
            return {
                selectedImg: undefined,
                selectedImgIndex: undefined,
                galleryActive: false,
                numberOfImgs: this.post.gallery.length
            }
        },
        created(){
            window.addEventListener("keyup", this.keyUpEvents);
            window.addEventListener("keydown", this.keyDownEvents);
        },
        beforeDestroy(){
            window.removeEventListener("keyup", this.keyUpEvents);
            window.removeEventListener("keydown", this.keyDownEvents);
        },
        methods: {
            open(index){
                this.selectedImgIndex = index;
                this.selectedImg = this.post.gallery[index];
                document.body.classList.add("gallery-open");
                this.galleryActive = true;
            },
            close(){
                document.body.classList.remove("gallery-open");
                this.galleryActive = false;
            },
            keyUpEvents(e){
                var self = this;
                var el;

                // RIGHT
                if(e.keyCode === 39 || e.which === 39)
                {
                    el = "nextImg";
                    self.nextImg();
                }

                // LEFT
                else if(e.keyCode === 37 || e.which === 37)
                {
                    el = "prevImg";
                    self.prevImg();
                }

                // ESC
                else if(e.keyCode === 27 || e.which === 27)
                {
                    el = "closeGallery";
                    self.close();
                }
                else
                {
                    return;
                }

                self.$refs[el].classList.remove("active");
            },
            keyDownEvents(e){
                var self = this;
                var el;

                // ESC
                if(e.keyCode === 27 || e.which === 27)
                {
                    el = "closeGallery";
                }
                else if(e.keyCode === 39 || e.which === 39)
                {
                    el = "nextImg";
                }
                else if(e.keyCode === 37 || e.which === 37)
                {
                    el = "prevImg";
                }
                else
                {
                    return;
                }

                self.$refs[el].classList.add("active");
            },
            nextImg(){
                if(this.selectedImgIndex == this.numberOfImgs - 1)
                {
                    this.selectedImgIndex = 0;
                }
                else
                {
                    this.selectedImgIndex += 1;
                }
                this.selectedImg = this.post.gallery[this.selectedImgIndex];
            },
            prevImg(){
                if(this.selectedImgIndex == 0)
                {
                    this.selectedImgIndex = this.numberOfImgs - 1;
                }
                else
                {
                    this.selectedImgIndex -= 1;
                }
                this.selectedImg = this.post.gallery[this.selectedImgIndex];
            }
        }
    }
</script>

<style lang="sass" scoped>

    @import "../global"

    #gallery
        width: 100%

    .img
        width: 23%
        margin: 1%
        float: left
        cursor: pointer
        border-radius: 10px

    .overlay
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        background-color: black
        z-index: 99998
        opacity: .85

    .fullScreen
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        z-index: 99999
        display: flex
        flex-direction: column
        justify-content: center
        align-items: center

    .fadeO-enter-active, .fadeG-leave-active
        transition: opacity .8s

    .fadeO-enter, .fadeO-leave-to
        opacity: 0

    .fadeO-enter-to, .fadeO-leave
        opacity: .85

    .fadeG-enter-active, .fadeO-leave-active
        transition: opacity 2s

    .fadeG-enter, .fadeG-leave-to
        opacity: 0

    .fadeG-enter-to, .fadeG-leave
        opacity: 1

    button
        border: solid 1px $colorSecondary1
        border-radius: 10px
        background: transparent
        color: $colorSecondary1
        padding: 5px 15px
        margin: 0
        cursor: pointer
        outline: none
        font-size: 1.1em

    button:active, button.active
        background: $colorSecondary1
        color: white

    .top
        padding: 20px 0

    .top p
        display: inline
        padding: 5px 15px
        margin: 0
        color: $colorSecondary1


    .closeBtn
        position: absolute
        right: 20px
        top: 20px

    .imgFullScreen
        max-height: 80%
        max-width: 92%
        @media only screen and (max-width: 1000px)
            max-width: 98%

    .description
        color: $colorSecondary1
        margin: 0
        padding: 15px

    .clear
        clear: both

    h2
        padding: 30px 0 20px

</style>
