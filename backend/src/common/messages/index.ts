import { en } from './en';

export type MessageKey = keyof typeof en;
export type Lang = 'en';

const catalogs: Record<Lang, typeof en> = { en };

export function getMessage(key: MessageKey, lang: Lang = 'en'): string {
  return catalogs[lang][key];
}

export { en };
