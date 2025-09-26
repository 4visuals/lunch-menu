<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { DailyMenu, MonthlyMenuDto, FoodData } from "./daily-menu";
  import { Y202510 } from "./dummy-data";

  const dispatch = createEventDispatcher<{
    close: void;
    menu: MonthlyMenuDto;
  }>();

  let menuText: string = Y202510;

  let year: number;
  let month: number;
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1];

  function convert() {
    const menus = menuText
      .trim()
      .split("\n")
      .map((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return null;

        const parts = trimmedLine.split(/\s+/);

        const dayString = parts.shift();
        if (!dayString || !/^\d+일$/.test(dayString)) return null;

        const day = parseInt(dayString, 10);

        const dayOfWeek = parts.shift();
        if (!dayOfWeek) return null;

        const menus: FoodData[] = parts.map((foodName) => ({
          uuid: crypto.randomUUID(),
          foodName,
        }));

        if (menus.length < 6 || menus.length > 8) {
          console.warn(
            `[Menu Input] Day ${day} has ${menus.length} menu items, which is not between 6 and 8.`
          );
        }

        return { day, dayOfWeek, menus };
      })
      .filter((item): item is DailyMenu => item !== null && !isNaN(item.day));

    dispatch("menu", { year, month, menus });
  }
</script>

<div class="container py-5">
  <h2>한달 메뉴 입력</h2>
  <form on:submit|preventDefault>
    <div class="row mb-3">
      <div class="col">
        <label for="year" class="form-label">연도</label>
        <select id="year" class="form-select" bind:value={year}>
          {#each years as y}
            <option value={y}>{y}년</option>
          {/each}
        </select>
      </div>
      <div class="col">
        <label for="month" class="form-label">월</label>
        <select id="month" class="form-select" bind:value={month}>
          {#each Array.from({ length: 12 }, (_, i) => i + 1) as m}
            <option value={m}>{m}월</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="mb-3">
      <label for="monthlyMenu" class="form-label"
        >월별 메뉴 (한 줄에 하루씩 입력)</label
      >
      <textarea
        class="form-control"
        id="monthlyMenu"
        rows="15"
        bind:value={menuText}
        placeholder={"1일 월요일 흑미밥 아욱된장국 쇠고기잡채 명엽채볶음 배추김치 멜론\n2일 화요일 ..."}
      ></textarea>
      <div id="menuHelp" class="form-text">
        각 줄은 '일자 요일 메뉴1 메뉴2 ...' 형식입니다. (예: 3일 수요일 쌀밥
        ...)
      </div>
    </div>
    <button type="button" class="btn btn-primary" on:click={convert}
      >변환</button
    >
    <button
      type="button"
      class="btn btn-secondary ms-2"
      on:click={() => dispatch("close")}>뒤로</button
    >
  </form>
</div>
