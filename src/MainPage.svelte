<script lang="ts">
  import MonthlyMenuInputForm from "./lib/MonthlyMenuInputForm.svelte";
  import LunchMenuForm from "./lib/LunchMenuForm.svelte";
  import type { MonthlyMenu, MonthlyMenuDto } from "./lib/daily-menu";
  import DailyLunchMenuView from "./lib/DailyLunchMenuView.svelte";
  import TopNav from "./lib/TopNav.svelte";
  import { greamApi } from "./lib/api/gream-api";
  import { convertToYMD } from "./lib/util";

  type ViewMode = "INTRO" | "INPUT_FORM" | "MENU";
  let viewMode: ViewMode = "INTRO";
  let monthyMenuDto: MonthlyMenuDto | null = null;
  let monthlyMenu: MonthlyMenu | undefined = undefined;
  let time = new Date();
  let ymd: [number, number, number] = convertToYMD(time);

  function handleMenuCreated(event: CustomEvent<MonthlyMenuDto>) {
    monthyMenuDto = event.detail;
    viewMode = "MENU";
  }
  async function fetchUsersMenu() {
    const ymd = `${time.getFullYear()}-${String(time.getMonth() + 1).padStart(2, "0")}`; // 'YYYY-MM' in local timezone
    const menu = await greamApi.fetchLunchMenu(ymd);
    monthlyMenu = menu;
    viewMode = "INTRO";
  }
  function updateYmd(e: CustomEvent<[number, number, number]>) {
    console.log(e.detail);
    ymd = e.detail;
  }
  fetchUsersMenu();
</script>

<div class="container">
  <div class="row">
    {#if viewMode === "INPUT_FORM"}
      <div class="col-12">
        <MonthlyMenuInputForm
          on:close={() => (viewMode = "INTRO")}
          on:menu={handleMenuCreated}
        />
      </div>
    {:else if viewMode === "MENU"}
      {#if monthyMenuDto}
        <div class="col-12">
          <LunchMenuForm
            menuData={monthyMenuDto}
            on:close={() => (viewMode = "INTRO")}
            on:created={fetchUsersMenu}
          />
        </div>
      {/if}
    {:else}
      <div class="col-12">
        <TopNav
          on:add={() => (viewMode = "INPUT_FORM")}
          {time}
          on:ymd={updateYmd}
        />
        <DailyLunchMenuView {ymd} menu={monthlyMenu} />
      </div>
      <!-- <div
    class="container vh-100 d-flex justify-content-center align-items-center"
  >
    <div class="d-grid gap-2 col-6 mx-auto">
      <button
        class="btn btn-primary"
        type="button"
        on:click={() => (viewMode = "INPUT_FORM")}>새 메뉴</button
      >
      <button class="btn btn-secondary" type="button">불러오기</button>
    </div>
  </div> -->
    {/if}
  </div>
</div>
