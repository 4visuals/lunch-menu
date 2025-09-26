export type FoodData = {
  uuid: string;
  foodName: string;
};
export type DailyMenu = {
  day: number;
  dayOfWeek: string;
  menus: FoodData[];
};
export type MonthlyMenuDto = {
  year: number;
  month: number;
  menus: DailyMenu[];
};
