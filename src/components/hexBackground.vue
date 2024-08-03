<template>
    <div id="hex-container">
        <div class="row" v-for="(i, idx) in 50" :key="idx">
            <div class="hexagon" v-for="(j, idx2) in 50" :key="idx2"></div>
        </div>
        <div class="cursor"></div>
    </div>
</template>
<script>
import $ from 'jquery'

export default {
    name: 'hexBackground',
    mounted() {
        let cursor = $(".cursor");
        window.onmousemove = function (e) {
            cursor.css("left", e.clientX + "px");
            cursor.css("top", e.clientY + "px");
        }
    },
    methods: {
        
    }
}
</script>
<style scoped> 
#hex-container {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
}

#hex-container .row {
    display: inline-flex;
    margin-top: -22px;
    margin-left: -80px;
    flex-wrap: nowrap !important;
}

#hex-container .row:nth-child(even) {
    margin-left: 0px;
}

#hex-container .hexagon {
    position: relative;
    width: 50px;
    height: 60px;
    background: var(--gray-high-3-hex);
    margin: 2px;
    margin-left: 1px;
    clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
    transition: 2s;
    z-index: 2;
}

    #hex-container .hexagon::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        background: var(--gray-high-2-hex);
        pointer-events: none;
        z-index: 2;
    }

#hex-container .cursor {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8vw;
    height: 8vw;
    background-image: linear-gradient(to right, var(--blue), var(--purple));
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: anim 4s linear infinite;
    z-index: 1;
    box-shadow: 0 0 20px 10px rgba(255, 255, 0, 0.8);
}

@keyframes anim {
    0% {
        filter: hue-rotate(0deg) blur(50px);
    }
    100% {
        filter: hue-rotate(360deg) blur(50px);
    }
}
</style>
  