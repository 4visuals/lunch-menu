<script lang="ts">
  import type { DailyMenu, MonthlyMenuDto } from "./daily-menu";
  import FoodSymbol from "./symbol/FoodSymbol.svelte";

  export let menuData: MonthlyMenuDto;
  let height: string = "120px";
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
            <td class="food"><FoodSymbol menuName={menu} /></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

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
</style>
