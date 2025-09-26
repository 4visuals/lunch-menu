<script lang="ts">
  export let src = "/je6.jpg";
  export let alt = "food symbol";
</script>

<div class="symbol">
  <img {src} {alt} />
</div>

<style lang="scss">
  .symbol {
    width: 100px;
    height: 100px;
    display: inline-block;
    vertical-align: middle;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
