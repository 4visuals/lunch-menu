<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Symbol from "./Symbol.svelte";
  let dispatch = createEventDispatcher<{ menu: string }>();
  export let menuName: string;
</script>

<button on:click={() => dispatch("menu", menuName)}>
  <Symbol />
  <span class="name">{menuName}</span>
</button>

<style lang="scss">
  button {
    position: relative;
    border: none;
    .name {
      position: absolute;
      left: 50%;
      bottom: 8px;
      font-size: 0.8rem;
      transform: translate(-50%, 0);
      background-color: white;
      padding: 4px 8px;
      white-space: nowrap;
      opacity: 0.8;
    }
  }
</style>
