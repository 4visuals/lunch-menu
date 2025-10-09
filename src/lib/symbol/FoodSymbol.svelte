<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Symbol from "./Symbol.svelte";
  import type { DailyMenu, FoodData } from "../daily-menu";
  let dispatch = createEventDispatcher<{
    menu: { food: FoodData; rect: DOMRect };
  }>();
  export let dailyMenu: DailyMenu;
  export let food: FoodData;
  export let activeFood: FoodData | undefined = undefined;
  export let symbolSize: string = "100px";
  export let foodNameVisible: boolean = true;
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
  <Symbol picture={food.picture} width={symbolSize} />
  {#if foodNameVisible}
    <span class="name">{food.foodName}</span>
  {/if}
</button>

<style lang="scss">
  button {
    position: relative;
    border: none;
    background-color: transparent;
    padding: 0;
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
