import { i18nDict } from "./i18n-en";

export type I18nDictionary = typeof i18nDict;
export type I18nKey = keyof typeof i18nDict;
export type I18nParams = Record<string, string | number>;
export class I18n {
  public readonly dict: I18nDictionary = i18nDict;
  public t(k: I18nKey, params?: I18nParams) {
    let str = this.dict[k];
    
    if (params) {
      if (typeof params.variation === 'number') {
        const match = /\[(.*?)\]/.exec(str);
        if (match) {
          const items = match[1].split('|');
          const selected = items[params.variation];
          str = str.replace(match[0], selected);
        }
      }

      for (const  f in params) {
        const re = new RegExp(`{${f}}`, 'g');
        str = str.replace(re, String(params[f]));
      }
    }

    return str;
  }
}

export const i18n = new I18n();