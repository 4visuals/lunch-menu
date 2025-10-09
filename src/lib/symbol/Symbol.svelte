<script lang="ts">
  import type { PicSource } from "../api/gream-type";

  // export let src = "/je6.jpg";
  // export let alt = "food symbol";
  export let width = "100px";
  export let picture: PicSource | undefined = undefined;

  function getImageUrl(picture?: PicSource) {
    return picture && picture.dto ? picture.getUrl() : "/empty_img.svg";
  }
  function getAlt(picture?: PicSource) {
    return picture && picture.dto ? picture.wordName : "입력";
  }
</script>

<button class="nude symbol" style="width: {width}; height: {width};" on:click>
  <img src={getImageUrl(picture)} alt={getAlt(picture)} />
</button>

<style lang="scss">
  .nude {
    outline: none;
    border: 1px solid transparent;
    padding: 0;
  }
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
