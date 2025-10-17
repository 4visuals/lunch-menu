import axios from 'axios'
import {
  PicSource,
  type BatchInsertResponse,
  type GreamMenuDto,
  type IPicSource,
  type WordBasket,
} from './gream-type'
import { menu202510 } from './dummy-202510'
import { MonthlyMenu, type DailyMenu, type MonthlyMenuDto } from '../daily-menu'

function convertToMenu(
  picture: IPicSource[],
  year: number,
  month: number
): DailyMenu[] {
  const dailyMenus: DailyMenu[] = [];
  let currentMenu: DailyMenu | null = null;

  const dateRegex = /(\d+)일\s+(.+)요일/;

  for (const pic of picture) {
    const match = pic.wordName.match(dateRegex);

    if (match && match.length > 2) {
      const day = parseInt(match[1], 10);
      const dayOfWeek = match[2]; 

      currentMenu = {
        day,
        dayOfWeek,
        menus: [],
      };
      dailyMenus.push(currentMenu);
    } else {
      if (currentMenu) {
        currentMenu.menus.push({
          foodName: pic.wordName,
          uuid: crypto.randomUUID(),
          picture: pic.picSeq === -1 ? undefined : new PicSource(pic),
        });
      }
    }
  }

  return dailyMenus;
}
export class GreamApi {
  constructor(private backendUrl: string) {
    console.log('[backend]', backendUrl)
    axios.defaults.withCredentials = true
  }
  async fetchLunchMenu(yyyyMM: string) {
    // menu202510.menus.forEach((m) => {
    //   m.menus.forEach((elem) => {
    //     //@ts-ignore
    //     elem.picture = new PicSource(elem.picture?.dto as IPicSource)
    //   })
    // })
    // const menu = new MonthlyMenu(menu202510 as MonthlyMenuDto)
    // return Promise.resolve(menu)
    const year = +yyyyMM.substring(0, 4)
    const month = +yyyyMM.substring(4)
    const res = await axios.get(this._resoloveUrl('/monthly-menus/latest'))
    const basket = res.data.basket as WordBasket
    const dto: MonthlyMenuDto = {
      year,
      month,
      menus: convertToMenu(basket.pictures, year, month),
    }
    return Promise.resolve(new MonthlyMenu(dto))
  }
  resolvePublicImagePath(path: string) {
    const midPath = '/resources/box/lunchmenu'
    path = path.startsWith('/') ? path.substring(1) : path
    return `${this.backendUrl}${midPath}/${path}`
  }
  private _resoloveUrl(uri: string) {
    uri = uri.startsWith('/') ? uri.substring(1) : uri
    return `${this.backendUrl}/${uri}`
  }
  /**
   * 상징 업로드
   * @param base64Image
   * @param word
   */
  async uploadSymbol(base64Image: string, word: string) {
    const param = { base64Image, word }
    const res = await axios.post(
      this._resoloveUrl('/reading/symbol'),
      new URLSearchParams(param),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      }
    )
    const symbol = res.data.symbol as IPicSource
    symbol.wordName = word
    return new PicSource(symbol as IPicSource)
  }
  /**
   * 그림한글에서 이미지 검색
   * @param keyword
   */
  async searchSymbol(
    keyword: string,
    mode: string = 'exact'
  ): Promise<PicSource[]> {
    const response = await axios.get(`${this.backendUrl}/word/search`, {
      params: {
        kw: keyword,
        mode: mode,
      },
    })
    return response.data.imgs.map((dto: IPicSource) => new PicSource(dto))
  }

  async createWorkdBook(bookName: string, monthCode: string) {
    if (monthCode.length !== 6) {
      alert('[error]' + monthCode)
      throw new Error('error', { cause: 'INVALID_YYYYMM' })
    }
    const response = await axios.post(`${this.backendUrl}/monthly-menus`, {
      bookName,
      monthCode,
    })
    return response.data.menu as GreamMenuDto
  }
  async insertPictures(basketSeq: number, pictures: PicSource[]) {
    const images = pictures.map((pic) => ({
      picSeq: pic.picSeq,
      word: pic.wordName,
    }))

    const res = await axios.post<BatchInsertResponse>(
      `${this.backendUrl}/monthly-menus/${basketSeq}`,
      images
    )

    // 서버 응답 구조 { results: [...], count: number }
    return res.data
  }
}

export const greamApi = new GreamApi(import.meta.env.VITE_BACKEND as string)
