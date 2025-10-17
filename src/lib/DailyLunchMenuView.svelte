<script lang="ts">
  import type { DailyMenu, MonthlyMenu } from './daily-menu'
  import FoodSymbol from './symbol/FoodSymbol.svelte'
  import viewImg from '../assets/icons/view_image.svg'
  import viewText from '../assets/icons/view_text.svg'
  import { greamApi } from './api/gream-api'

  export let ymd: [number, number, number]
  export let menu: MonthlyMenu | undefined

  let todayMenu: DailyMenu

  function bindCurrentMenu(
    menu: MonthlyMenu | undefined,
    ymd: [number, number, number],
  ) {
    if (menu) {
      const found = menu.menus.find((elem) => elem.day === ymd[2])
      if (!found) {
        console.error('no daily menu for ', ymd)
        return
      }
      todayMenu = found
      console.log('[today]', todayMenu)
    }
  }
  $: bindCurrentMenu(menu, ymd)
</script>

<section
  style="background-image: url({greamApi.resolvePublicImagePath(
    '/tray_800.png',
  )})"
>
  {#if menu}
    <div class="food side p0">
      <div class="food-pic">
        <FoodSymbol
          food={todayMenu.menus[2]}
          dailyMenu={todayMenu}
          symbolSize="100%"
          foodNameVisible={false}
        />
      </div>
      <span class="control left">
        <button class="blue icon round">
          <img src={viewText} alt="View Image" />
        </button>
      </span>
      <span class="control right">
        <button class="blue icon round">
          <img src={viewImg} alt="View Image" />
        </button>
      </span>
      <span class="foodname">{todayMenu.menus[2].foodName}</span>
    </div>
    <div class="food side p1">
      <div class="food-pic">
        <FoodSymbol
          food={todayMenu.menus[3]}
          dailyMenu={todayMenu}
          symbolSize="100%"
          foodNameVisible={false}
        />
      </div>
      <span class="control left">
        <button class="blue icon round">
          <img src={viewText} alt="View Image" />
        </button>
      </span>
      <span class="control right">
        <button class="blue icon round">
          <img src={viewImg} alt="View Image" />
        </button>
      </span>
      <span class="foodname">{todayMenu.menus[3].foodName}</span>
    </div>
    <div class="food side p2">
      <div class="food-pic">
        <FoodSymbol
          food={todayMenu.menus[4]}
          dailyMenu={todayMenu}
          symbolSize="100%"
          foodNameVisible={false}
        />
      </div>
      <span class="control left">
        <button class="blue icon round">
          <img src={viewText} alt="View Image" />
        </button>
      </span>
      <span class="control right">
        <button class="blue icon round">
          <img src={viewImg} alt="View Image" />
        </button>
      </span>
      <span class="foodname">{todayMenu.menus[4].foodName}</span>
    </div>
    <div class="food side p3">
      <div class="food-pic">
        <FoodSymbol
          food={todayMenu.menus[5]}
          dailyMenu={todayMenu}
          symbolSize="100%"
          foodNameVisible={false}
        />
      </div>
      <span class="control left">
        <button class="blue icon round">
          <img src={viewText} alt="View Image" />
        </button>
      </span>
      <span class="control right">
        <button class="blue icon round">
          <img src={viewImg} alt="View Image" />
        </button>
      </span>
      <span class="foodname">{todayMenu.menus[5].foodName}</span>
    </div>
    <div class="food main p0">
      <div class="food-pic">
        <FoodSymbol
          food={todayMenu.menus[0]}
          dailyMenu={todayMenu}
          symbolSize="100%"
          foodNameVisible={false}
        />
      </div>
      <span class="control left">
        <button class="blue icon round">
          <img src={viewText} alt="View Image" />
        </button>
      </span>
      <span class="control right">
        <button class="blue icon round">
          <img src={viewImg} alt="View Image" />
        </button>
      </span>
      <span class="foodname">{todayMenu.menus[0].foodName}</span>
    </div>
    <div class="food main p1">
      <div class="food-pic">
        <FoodSymbol
          food={todayMenu.menus[1]}
          dailyMenu={todayMenu}
          symbolSize="100%"
          foodNameVisible={false}
        />
      </div>
      <span class="control left">
        <button class="blue icon round">
          <img src={viewText} alt="View Image" />
        </button>
      </span>
      <span class="control right">
        <button class="blue icon round">
          <img src={viewImg} alt="View Image" />
        </button>
      </span>
      <span class="foodname">{todayMenu.menus[1].foodName}</span>
    </div>
  {:else}
    <p>메뉴 없음</p>
  {/if}
</section>

<style lang="scss">
  button {
    &.icon {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      border: none;
      outline: none;
      background: transparent;
    }
    &.blue {
      background-color: #2196f3;
    }
    &.round {
      border-radius: 50px;
    }
  }
  section {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 957px;
    aspect-ratio: 957 / 800;

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    .food {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      &.side {
        top: 12%;
        width: 20%;
        // height: 22%;
        &.p0 {
          left: 7%;
        }
        &.p1 {
          left: 30%;
        }
        &.p2 {
          left: 51%;
        }
        &.p3 {
          left: 74%;
        }
        .food-pic {
          border-radius: 10%;
        }
        .foodname {
          top: -10px;
          left: 50%;
          transform: translate(-50%, -100%);
          background-color: white;
          font-size: 1.5rem;
          padding: 0 8px;
          white-space: nowrap;
        }
      }
      &.main {
        top: 47%;

        &.p0 {
          left: 9%;
          width: 37%;
          height: 43%;
        }
        &.p1 {
          left: 55%;
          width: 37%;
          height: 43%;
        }
        .food-pic {
          background-color: #ff87669a;
          border-radius: 10%;
        }
        .foodname {
          bottom: -10px;
          left: 50%;
          transform: translate(-50%, 100%);
          background-color: white;
          font-size: 1.5rem;
          padding: 0 8px;
          white-space: nowrap;
        }
      }
      .food-pic {
        position: relative;
        overflow: hidden;
        background-color: #ffffff9a;
      }
      .foodname {
        position: absolute;
      }
      .control {
        position: absolute;
        top: 0px;

        &.left {
          left: 0;
        }
        &.right {
          right: 0;
        }
      }
    }
  }
</style>
