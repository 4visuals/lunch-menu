<script lang="ts">
  export let src = "/je6.jpg";
  export let alt = "food symbol";
  export let width = "100px";
</script>

<div class="symbol" style="width: {width}; height: {width};" on:click>
  <img {src} {alt} />
</div>

<style lang="scss">
  .symbol {
    display: inline-block;
    vertical-align: middle;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
