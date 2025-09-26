<script lang="ts">
  import type { FoodData, MonthlyMenuDto } from "./daily-menu";
  import FoodSymbol from "./symbol/FoodSymbol.svelte";
  import FoodSymbolEditor from "./FoodSymbolEditor.svelte";
  import { writable, type Writable } from "svelte/store";
  import { onMount, onDestroy } from "svelte";

  export let menuData: MonthlyMenuDto;
  let activeFood: FoodData | undefined = undefined;
  let height: string = "120px";
  let floatingMenuElement: HTMLDivElement;

  const floatingMenu: Writable<{
    left: string;
    top: string;
    visible: boolean;
  }> = writable({
    left: "",
    top: "",
    visible: false,
  });

  function hideFloatingMenu() {
    floatingMenu.update((store) => {
      store.visible = false;
      store.left = "";
      store.top = "";
      return store;
    });
  }
  function showFoodEditor(e: CustomEvent<{ food: FoodData; rect: DOMRect }>) {
    const { food, rect } = e.detail;
    activeFood = food;

    $floatingMenu.left = `${rect.left}px`;
    $floatingMenu.top = `${rect.bottom + 8}px`;
    $floatingMenu.visible = true;
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      floatingMenuElement &&
      !floatingMenuElement.contains(event.target as Node)
    ) {
      hideFloatingMenu();
    }
  }

  onMount(() => {
    document.addEventListener("click", handleClickOutside, true);
  });

  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside, true);
  });
</script>

<div class="container-fluid py-5">
  <h2>{menuData.year}년 {menuData.month}월 새 점심 메뉴</h2>
  <table
    class="table table-bordered text-center"
    style="--menu-cell-height: {height}"
  >
    <thead>
      <tr>
        <th>날짜</th>
        <th>밥</th>
        <th>국</th>
        <th>반찬1</th>
        <th>반찬2</th>
        <th>반찬3</th>
        <th>반찬4</th>
        <th>김치</th>
      </tr>
    </thead>
    <tbody>
      {#each menuData.menus as dailyMenu}
        <tr>
          <td class="dom">{dailyMenu.day} ({dailyMenu.dayOfWeek})</td>
          {#each dailyMenu.menus as menu}
            <td class="food"
              ><FoodSymbol
                {activeFood}
                food={menu}
                on:menu={showFoodEditor}
              /></td
            >
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

{#if $floatingMenu.visible && activeFood}
  <div
    class="floating-menu"
    style="left: {$floatingMenu.left}; top:{$floatingMenu.top}"
    bind:this={floatingMenuElement}
  >
    <FoodSymbolEditor food={activeFood} on:close={hideFloatingMenu} />
  </div>
{/if}

<style lang="scss">
  table.table {
    tbody {
      tr {
        td {
          height: var(--menu-cell-height, 100px);
          &.food {
            padding: 0;
          }
        }
      }
    }
  }
  .floating-menu {
    position: absolute;
    z-index: 100;
  }
</style>
