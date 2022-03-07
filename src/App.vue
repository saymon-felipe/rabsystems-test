<template>
  <div id="app">
    <router-view path="$router.key" />
  </div>
</template>

<script>
import './css/global.css';
import './assets/fontawesome/css/all.css';
import './css/rabsystemsTelInput.css';
import './js/rabsystemsTelInput.js';
import './css/bootstrap.min.css';
import '@lottiefiles/lottie-player';

export default {
  name: 'App'
}
</script>
