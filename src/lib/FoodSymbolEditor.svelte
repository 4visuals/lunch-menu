<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import type { FoodData } from './daily-menu'
  import Symbol from './symbol/Symbol.svelte'
  import { greamApi } from './api/gream-api'
  import { writable, type Writable } from 'svelte/store'
  import type { PicSource } from './api/gream-type'
  export let food: FoodData
  export let weekIndex: number
  export let flushAll: boolean
  export let sameMenus: FoodData[] = []
  let inputEl: HTMLInputElement
  const dispatch = createEventDispatcher<{
    close: void
    choose: { picture: PicSource; weekIndex: number }
    'flush-state': boolean
    'add-picture': void
  }>()
  const close = () => dispatch('close')

  const images: Writable<PicSource[]> = writable([])
  async function searchSymbol(keyword: string) {
    $images = []
    const symbols = await greamApi.searchSymbol(keyword)
    $images = symbols
  }

  function flush(e: Event) {
    dispatch('flush-state', (e.target as HTMLInputElement)!.checked)
  }
  const searchByInput = (e: Event) => {
    const { value } = inputEl
    if (!value.trim()) {
      return
    }
    searchSymbol(value.trim())
  }
  $: searchSymbol(food.foodName)

  function symbolClicked(picture: PicSource): void {
    dispatch('choose', { picture, weekIndex })
  }
</script>

<svelte:window on:keydown={(e) => e.key === 'Escape' && close()} />

<div class="symbol-picker">
  <div class="form-row">
    <div class="desc-input">
      <input
        type="text"
        class="form-control"
        value={food.foodName}
        bind:this={inputEl}
      />
      <button class="btn btn-primary" on:click={searchByInput}>Search</button>
    </div>
  </div>
  <div class="same-menus">
    <span>{sameMenus.length}개</span>
    <span
      ><label for="flush-all"
        ><input
          id="flush-all"
          type="checkbox"
          checked={flushAll}
          on:change={flush}
        /><span>모두 적용</span></label
      ></span
    >
  </div>
  <div class="symbols">
    {#each $images as symbol}
      <Symbol
        picture={symbol}
        width="75px"
        on:click={() => symbolClicked(symbol)}
      />
    {/each}
    <button
      class="imgGroup reg-symbol"
      on:click={() => dispatch('add-picture')}
    >
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
