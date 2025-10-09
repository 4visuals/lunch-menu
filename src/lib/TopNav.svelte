<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { convertToYMD } from "./util";

  export let time: Date;

  const dispatch = createEventDispatcher<{
    add: void;
    ymd: [number, number, number];
  }>();

  $: ymd = convertToYMD(time);
  $: date = `${ymd[0]}-${String(ymd[1]).padStart(2, "0")}-${String(
    ymd[2]
  ).padStart(2, "0")}`;

  function handleDateChange(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const [year, month, day] = target.value.split("-").map(Number);
    dispatch("ymd", [year, month, day]);
  }
</script>

<nav class="navbar navbar-expand navbar-light bg-light">
  <div class="container-fluid">
    <div class="navbar-nav">
      <input
        type="date"
        class="form-control"
        value={date}
        on:change={handleDateChange}
      />
    </div>
    <div class="navbar-nav mx-auto">
      <span class="navbar-brand h1 mb-0">오늘의 급식</span>
    </div>
    <div class="navbar-nav">
      <button class="btn btn-primary" on:click={() => dispatch("add")}
        >메뉴 추가</button
      >
    </div>
  </div>
</nav>
