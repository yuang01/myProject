<template>
  <div class="building">
    <img src="../../assets/building-images/building.jpg" width="100%" height="120%" alt="">
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'building',
  created() {
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">
.building {
  width: 100%;
  height: calc(100vh - 90px);
  overflow: hidden;
}
</style>