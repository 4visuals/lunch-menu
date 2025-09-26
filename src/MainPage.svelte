<script lang="ts">
  import MonthlyMenuInputForm from "./lib/MonthlyMenuInputForm.svelte";
  import LunchMenuForm from "./lib/LunchMenuForm.svelte";
  import type { MonthlyMenuDto } from "./lib/daily-menu";

  type ViewMode = "INTRO" | "INPUT_FORM" | "MENU";
  let viewMode: ViewMode = "INTRO";

  let menuData: MonthlyMenuDto | null = null;

  function handleMenuCreated(event: CustomEvent<MonthlyMenuDto>) {
    menuData = event.detail;
    viewMode = "MENU";
  }
</script>

{#if viewMode === "INPUT_FORM"}
  <MonthlyMenuInputForm
    on:close={() => (viewMode = "INTRO")}
    on:menu={handleMenuCreated}
  />
{:else if viewMode === "MENU"}
  {#if menuData}
    <LunchMenuForm {menuData} on:close={() => (viewMode = "INTRO")} />
  {/if}
{:else}
  <div
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
  </div>
{/if}
