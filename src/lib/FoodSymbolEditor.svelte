<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { FoodData } from "./daily-menu";
  import Symbol from "./symbol/Symbol.svelte";
  import { greamApi } from "./api/gream-api";
  import { writable, type Writable } from "svelte/store";
  import type { PicSource } from "./api/gream-type";
  export let food: FoodData;
  const dispatch = createEventDispatcher();
  const close = () => dispatch("close");

  const images: Writable<PicSource[]> = writable([]);
  async function searchSymbol(keyword: string) {
    $images = [];
    const symbols = await greamApi.searchSymbol(keyword);
    $images = symbols;
  }
  $: searchSymbol(food.foodName);
  onMount(() => {
    // searchSymbol(food.foodName);
  });
</script>

<svelte:window on:keydown={(e) => e.key === "Escape" && close()} />

<div class="symbol-picker">
  <div class="form-row">
    <div class="desc-input">
      <input type="text" class="form-control" value={food.foodName} />
      <button class="btn btn-primary">Search</button>
    </div>
  </div>
  <div class="symbols">
    {#each $images as symbol}
      <Symbol src={symbol.getUrl()} alt={symbol.picName} width="75px" />
    {/each}
    <button class="imgGroup reg-symbol">
      <span class="center-icon material-icons">add</span>
    </button>
  </div>
</div>

<style lang="scss">
  .btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition:
      color 0.15s ease-in-out,
      background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out,
      box-shadow 0.15s ease-in-out;
  }
  .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
  .symbol-picker {
    display: flex;
    flex-direction: column;
    row-gap: 16px;
    background-color: white;
    box-shadow: 0 0 8px #0000004d;
    border-radius: 8px;
    padding: 16px;
    width: 400px;
    .desc-input {
      display: flex;
      gap: 8px;
      input {
        flex-grow: 1;
      }
    }
    .symbols {
      display: flex;
      flex-wrap: wrap;
    }
    .reg-symbol {
      border: 3px dashed #9a9a9a;
      width: 75px;
      border-radius: 9px;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      color: #9a9a9a;
    }
  }
</style>
