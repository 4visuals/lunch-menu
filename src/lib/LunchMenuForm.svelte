<script lang="ts">
  import {
    MonthlyMenu,
    type DailyMenu,
    type FoodData,
    type MonthlyMenuDto,
  } from "./daily-menu";
  import FoodSymbol from "./symbol/FoodSymbol.svelte";
  import FoodSymbolEditor from "./FoodSymbolEditor.svelte";
  import { get, writable, type Writable } from "svelte/store";
  import { onMount, onDestroy } from "svelte";
  import { PicSource, type IPicSource } from "./api/gream-type";
  import { greamApi } from "./api/gream-api";
  import Modal from "./component/Modal.svelte";
  import SymbolCaptureForm from "./component/SymbolCaptureForm.svelte";

  export let menuData: MonthlyMenuDto;
  let activeFood: FoodData | undefined = undefined;
  let height: string = "120px";
  let floatingMenuElement: HTMLDivElement;

  const monthlyMenu = new MonthlyMenu(menuData);

  const floatingMenu: Writable<{
    left: string;
    top: string;
    dailyMenu: DailyMenu;
    weekIndex: number;
    visible: boolean;
    /**
     * 모두 적용 여부
     */
    flushAll: boolean;
  }> = writable({
    left: "",
    top: "",
    dailyMenu: {} as DailyMenu,
    weekIndex: -1,
    visible: false,
    flushAll: false,
  });

  const captureForm: Writable<{ visible: boolean }> = writable({
    visible: false,
  });

  $: if ($floatingMenu.visible && floatingMenuElement) {
    const menuRect = floatingMenuElement.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const currentLeft = parseFloat($floatingMenu.left);

    if (currentLeft + menuRect.width > windowWidth) {
      const newLeft = windowWidth - menuRect.width - 16; // 16px padding
      $floatingMenu.left = `${newLeft < 0 ? 0 : newLeft}px`;
    }
  }

  function hideFloatingMenu() {
    floatingMenu.update((store) => {
      store.visible = false;
      store.left = "";
      store.top = "";
      return store;
    });
  }
  function showFoodEditor(
    e: CustomEvent<{ food: FoodData; rect: DOMRect }>,
    dailyMenu: DailyMenu,
    weekIndex: number
  ) {
    const { food, rect } = e.detail;
    activeFood = food;
    $floatingMenu.dailyMenu = dailyMenu;
    $floatingMenu.weekIndex = weekIndex;
    $floatingMenu.left = `${rect.left}px`;
    $floatingMenu.top = `${rect.bottom + window.scrollY + 8}px`;
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
  function bindFoodPicture(picture: PicSource, weekIndex: number) {
    // console.log($floatingMenu.dailyMenu.dayOfWeek, pic, weekIndex);
    const { dailyMenu, flushAll } = get(floatingMenu);
    monthlyMenu.bindFood(dailyMenu, weekIndex, picture, flushAll);
  }

  function updateFlush(flushAll: boolean) {
    floatingMenu.update((store) => {
      store.flushAll = flushAll;
      return store;
    });
  }
  async function startAutoPictureProcedure() {
    const menus = monthlyMenu.distinctMenus;
    for (const menu of menus) {
      if (menu.picture) {
        continue;
      }
      const symbols = await greamApi.searchSymbol(menu.foodName);
      if (symbols.length > 0) {
        const sameMenus = monthlyMenu.findSameMenuByName(menu.foodName);
        for (const sameMenu of sameMenus) {
          sameMenu.picture = symbols[0];
          monthlyMenu.update();
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    monthlyMenu.update();
  }
  function showCaptureForm() {
    captureForm.update((form) => {
      form.visible = true;
      return form;
    });
  }
  onMount(() => {
    document.addEventListener("click", handleClickOutside, true);
  });

  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside, true);
  });

  async function uploadMonthlyMenu() {
    const pictures = monthlyMenu.toDailyPictures();
    const basket = await greamApi.createWorkdBook($monthlyMenu.name);
    await greamApi.insertPictures(basket.seq, pictures);
  }
</script>

<div class="container-fluid table-wrapper">
  <h2>
    <span>{$monthlyMenu.year}년 {$monthlyMenu.month}월 새 점심 메뉴</span><span
      >{$monthlyMenu.countOfEmpty}/ {$monthlyMenu.total}</span
    >
    <button
      class="btn btn-primary auto-load"
      on:click={startAutoPictureProcedure}>자동조회</button
    >
    <button class="btn butn-success" on:click={uploadMonthlyMenu}>업로드</button
    >
  </h2>
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
      {#each $monthlyMenu.menus as dailyMenu}
        <tr>
          <td class="dom" data-dow={dailyMenu.dayOfWeek}
            >{dailyMenu.day} ({dailyMenu.dayOfWeek})</td
          >
          {#each dailyMenu.menus as menu, index}
            <td class="food"
              ><FoodSymbol
                {dailyMenu}
                {activeFood}
                food={menu}
                on:menu={(e) => showFoodEditor(e, dailyMenu, index)}
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
    <FoodSymbolEditor
      food={activeFood}
      sameMenus={monthlyMenu.findSameMenuByName(activeFood.foodName)}
      weekIndex={$floatingMenu.weekIndex}
      flushAll={$floatingMenu.flushAll}
      on:close={hideFloatingMenu}
      on:choose={(e) => bindFoodPicture(e.detail.picture, e.detail.weekIndex)}
      on:flush-state={(e) => updateFlush(e.detail)}
      on:add-picture={showCaptureForm}
    />
  </div>
{/if}
{#if $captureForm.visible}
  <Modal showModal={true}>
    <SymbolCaptureForm />
  </Modal>
{/if}

<style lang="scss">
  .table-wrapper {
    position: relative;
    h2 {
      position: sticky;
      padding: 16px 16px 8px;
      background-color: white;
      z-index: 1000;
      top: 0;
      box-shadow: 0 0 8px #0000004d;
    }
  }
  table.table {
    tbody {
      tr {
        td {
          height: var(--menu-cell-height, 100px);
          &.food {
            padding: 0;
            vertical-align: middle;
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
