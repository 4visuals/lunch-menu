export type IPicSource = {
  wordSeq: number;
  wordName: string;
  picSeq: number;
  picName: string;
  type: string | null;
  genName: string;
  fileLength: number;
  origin: string;
  orderNum: number;
  pumsa: string | null;
  fingerprint: string | null;
};

export interface WordInsertResult {
  success: boolean;
  picSeq: number;
  word: string;
  orderNum?: number;
  cause?: string;
}

export interface WordBasket {
  seq: number;
  basketName: string;
  generatedTime: number;
  pictures: any[];
}
export interface BatchInsertResponse {
  results: WordInsertResult[];
  count: number;
}

export class PicSource {
  constructor(readonly dto: IPicSource) {}

  get wordSeq(): number {
    return this.dto.wordSeq;
  }

  get wordName(): string {
    return this.dto.wordName;
  }

  get picSeq(): number {
    return this.dto.picSeq;
  }

  get picName(): string {
    return this.dto.picName;
  }

  get type(): string | null {
    return this.dto.type;
  }

  get genName(): string {
    return this.dto.genName;
  }

  get fileLength(): number {
    return this.dto.fileLength;
  }

  get origin(): string {
    return this.dto.origin;
  }

  get orderNum(): number {
    return this.dto.orderNum;
  }

  get pumsa(): string | null {
    return this.dto.pumsa;
  }

  get fingerprint(): string | null {
    return this.dto.fingerprint;
  }
  getUrl() {
    return `https://kr.object.ncloudstorage.com/aacweb/symbols/after/${this.origin}/${this.genName}`;
  }
}
