<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Symbol from "./Symbol.svelte";
  import type { FoodData } from "../daily-menu";
  let dispatch = createEventDispatcher<{
    menu: { food: FoodData; rect: DOMRect };
  }>();
  export let food: FoodData;
  export let activeFood: FoodData | undefined;
  let buttonEl: HTMLButtonElement;
</script>

<button
  bind:this={buttonEl}
  class:active={food === activeFood}
  on:click={() =>
    dispatch("menu", {
      food,
      rect: buttonEl.getBoundingClientRect(),
    })}
>
  <Symbol />
  <span class="name">{food.foodName}</span>
</button>

<style lang="scss">
  button {
    position: relative;
    border: none;
    background-color: transparent;
    &.active {
      border-radius: 8px;
      box-shadow: 0 0 0 2px #007bff;
    }
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
