import { DEFAULT_LANG, LANGS, t, type Lang } from '../i18n';

const STORAGE_KEY = 'gr-lang';
const valid = (value: unknown): value is Lang => LANGS.some(l => l.code === value);

export const currentLang = (): Lang => {
  const set = document.documentElement.dataset.lang;
  return valid(set) ? set : DEFAULT_LANG;
};

/** Swaps every [data-i18n*] text on the page, remembers the choice and announces it. */
export function applyLang(lang: Lang, remember = true) {
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = LANGS.find(l => l.code === lang)!.html;

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n!, lang); });
  document.querySelectorAll<HTMLElement>('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml!, lang); });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria!, lang)); });
  document.querySelectorAll<SVGTitleElement>('title[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n!, lang); });

  document.title = t('meta.title', lang);
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.desc', lang));
  document.querySelectorAll<HTMLButtonElement>('button[data-lang]').forEach(button => {
    const active = button.dataset.lang === lang;
    button.setAttribute('aria-pressed', String(active));
  });

  if (remember) { try { localStorage.setItem(STORAGE_KEY, lang); } catch { /* private mode */ } }
  document.dispatchEvent(new CustomEvent('lang:change', { detail: lang }));
}

export function initLang() {
  let saved: string | null = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* private mode */ }
  document.documentElement.dataset.lang = DEFAULT_LANG;
  if (valid(saved) && saved !== DEFAULT_LANG) applyLang(saved, false);
  else document.querySelector<HTMLButtonElement>(`button[data-lang="${DEFAULT_LANG}"]`)?.setAttribute('aria-pressed', 'true');
  document.querySelectorAll<HTMLButtonElement>('button[data-lang]').forEach(button => {
    button.addEventListener('click', () => applyLang(button.dataset.lang as Lang));
  });
}
