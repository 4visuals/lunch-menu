import axios from "axios";
import { PicSource, type IPicSource } from "./gream-type";

export class GreamApi {
  constructor(private backendUrl: string) {
    console.log("[backend]", backendUrl);
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
}

export const greamApi = new GreamApi(import.meta.env.VITE_BACKEND as string);
