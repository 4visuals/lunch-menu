import { writable, type Writable } from 'svelte/store'
import { SvelteStore } from './store/svelte-store'
import { PicSource, type IPicSource } from './api/gream-type'

export type FoodData = {
  /**
   * 그림한글 상징 이미지PK
   *
   */
  picture?: PicSource
  uuid: string
  foodName: string
}
export type DailyMenu = {
  day: number
  dayOfWeek: string
  menus: FoodData[]
}
export type MonthlyMenuDto = {
  year: number
  month: number
  menus: DailyMenu[]
}

const dateImageMap: Record<number, { picSeq: number }> = {
  0: { picSeq: 2640 },
  1: { picSeq: 2641 },
  2: { picSeq: 2642 },
  3: { picSeq: 2643 },
  4: { picSeq: 2644 },
  5: { picSeq: 2645 },
  6: { picSeq: 2646 },
  7: { picSeq: 2647 },
  8: { picSeq: 2648 },
  9: { picSeq: 2649 },
  10: { picSeq: 2650 },
  11: { picSeq: 2651 },
  12: { picSeq: 2652 },
  13: { picSeq: 2653 },
  14: { picSeq: 2654 },
  15: { picSeq: 2655 },
  16: { picSeq: 2656 },
  17: { picSeq: 2657 },
  18: { picSeq: 2658 },
  19: { picSeq: 2659 },
  20: { picSeq: 2660 },
  21: { picSeq: 2661 },
  22: { picSeq: 2662 },
  23: { picSeq: 2663 },
  24: { picSeq: 2664 },
  25: { picSeq: 2665 },
  26: { picSeq: 2666 },
  27: { picSeq: 2667 },
  28: { picSeq: 2668 },
  29: { picSeq: 2669 },
  30: { picSeq: 2670 },
  31: { picSeq: 2671 },
}
export class MonthlyMenu extends SvelteStore<MonthlyMenu> {
  bindFood(
    dailyMenu: DailyMenu,
    weekIndex: number,
    picture: PicSource,
    flushAll: boolean
  ) {
    if (flushAll) {
      const sameMenus = this.findSameMenuByName(
        dailyMenu.menus[weekIndex].foodName
      )
      for (const menu of sameMenus) {
        menu.picture = picture
      }
    } else {
      dailyMenu.menus[weekIndex].picture = picture
    }
    this.update() // call to reactivity
  }
  protected store: Writable<MonthlyMenu>
  private _menuCache = new Map<string, FoodData[]>()
  constructor(readonly dto: MonthlyMenuDto) {
    super()
    this.store = writable(this)
  }
  get name(): string {
    return `${this.dto.year}년${this.dto.month}월메뉴`
  }
  get year() {
    return this.dto.year
  }
  get month() {
    return this.dto.month
  }
  get menus() {
    return this.dto.menus
  }
  get total() {
    return this.dto.menus.reduce(
      (acc, dailyMenu) => acc + dailyMenu.menus.length,
      0
    )
  }
  /**
   * returns 'YYYYMM'
   */
  get ymText() {
    return `${this.year}${String(this.month).padStart(2, '0')}`
  }
  get countOfEmpty() {
    return this.dto.menus.reduce(
      (acc, dailyMenu) =>
        acc + dailyMenu.menus.filter((menu) => !menu.picture).length,
      0
    )
  }
  get distinctMenus() {
    const seen = new Set<string>()
    const distinct: FoodData[] = []
    for (const dailyMenu of this.dto.menus) {
      for (const menu of dailyMenu.menus) {
        if (!seen.has(menu.foodName)) {
          seen.add(menu.foodName)
          distinct.push(menu)
        }
      }
    }
    return distinct
  }
  findSameMenuByName(foodName: string) {
    if (this._menuCache.has(foodName)) {
      return this._menuCache.get(foodName) ?? []
    }
    const result: FoodData[] = []
    for (const dailyMenu of this.dto.menus) {
      for (const menu of dailyMenu.menus) {
        if (menu.foodName === foodName) {
          result.push(menu)
        }
      }
    }
    this._menuCache.set(foodName, result)
    return result
  }
  /**
   * 주간 메뉴를 앞에 "날짜 요일"을 하나로 포함해서 전송함
   * @param menu
   */
  toDailyPictures() {
    const pictures = this.menus
      .flatMap((daily) => {
        daily.day
        const picName = `${daily.day}일 ${daily.dayOfWeek}` // '3일 목요일'
        const picSeq = dateImageMap[daily.day].picSeq
        const menus = [...daily.menus]
        menus.unshift({
          foodName: picName,
          uuid: crypto.randomUUID(),
          picture: new PicSource({
            picSeq,
            wordName: picName,
          } as IPicSource),
        })
        return menus
      })
      // .flatMap((menu) => menu.menus)
      .map((food) => {
        const { picture } = food
        return picture
          ? picture
          : new PicSource({
              picSeq: -1,
              wordName: food.foodName,
            } as IPicSource)
      })

    return pictures
  }
}
