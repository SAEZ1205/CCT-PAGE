import { extractAfterMain, extractBeforeMain, extractSelector } from '../legacy/extract';

export const beforeMainMarkup = extractBeforeMain();
export const footerMarkup = extractSelector('footer.footer');
export const afterMainMarkup = extractAfterMain();
