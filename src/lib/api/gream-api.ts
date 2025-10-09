import axios from "axios";
import {
  PicSource,
  type BatchInsertResponse,
  type IPicSource,
  type WordBasket,
} from "./gream-type";
import { menu202510 } from "./dummy-202510";
import { MonthlyMenu, type MonthlyMenuDto } from "../daily-menu";

export class GreamApi {
  constructor(private backendUrl: string) {
    console.log("[backend]", backendUrl);
  }
  fetchLunchMenu(yyyyMM: string) {
    menu202510.menus.forEach((m) => {
      m.menus.forEach((elem) => {
        //@ts-ignore
        elem.picture = new PicSource(elem.picture?.dto as IPicSource);
      });
    });
    const menu = new MonthlyMenu(menu202510 as MonthlyMenuDto);
    return Promise.resolve(menu);
  }
  /**
   * 그림한글에서 이미지 검색
   * @param keyword
   */
  async searchSymbol(
    keyword: string,
    mode: string = "exact"
  ): Promise<PicSource[]> {
    const response = await axios.get(`${this.backendUrl}/word/search`, {
      params: {
        kw: keyword,
        mode: mode,
      },
    });
    return response.data.imgs.map((dto: IPicSource) => new PicSource(dto));
  }

  async createWorkdBook(name: string) {
    const response = await axios.post(`${this.backendUrl}/word/newbook`, null, {
      params: { name },
    });
    return response.data.basket as WordBasket;
  }
  async insertPictures(basketSeq: number, pictures: PicSource[]) {
    const images = pictures.map((pic) => ({
      picSeq: pic.picSeq,
      word: pic.wordName,
    }));

    const res = await axios.post<BatchInsertResponse>(
      `${this.backendUrl}/word/insert/batch?basket=${basketSeq}`,
      images,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    // 서버 응답 구조 { results: [...], count: number }
    return res.data;
  }
}

export const greamApi = new GreamApi(import.meta.env.VITE_BACKEND as string);
