export type DailyMenu = {
  day: number;
  dayOfWeek: string;
  menus: string[];
};
export type MonthlyMenuDto = {
  year: number;
  month: number;
  menus: DailyMenu[];
};
