import snapshot from './snapshot.html?raw';

const parsed = new DOMParser().parseFromString(snapshot, 'text/html');

function clean(node: Element): string {
  const clone = node.cloneNode(true) as Element;
  clone.querySelectorAll('script').forEach((script) => script.remove());
  return clone.outerHTML;
}

export function extractView(view: string): string {
  const node = parsed.querySelector(`[data-view="${view}"]`);
  return node ? clean(node) : '';
}

export function extractSelector(selector: string): string {
  const node = parsed.querySelector(selector);
  return node ? clean(node) : '';
}

export function extractBeforeMain(): string {
  const main = parsed.querySelector('#appMain');
  if (!main) return '';
  const chunks: string[] = [];
  for (const child of Array.from(parsed.body.children)) {
    if (child === main) break;
    if (child.tagName !== 'SCRIPT') chunks.push(clean(child));
  }
  return chunks.join('\n');
}

export function extractAfterMain(): string {
  const main = parsed.querySelector('#appMain');
  if (!main) return '';
  const chunks: string[] = [];
  let current = main.nextElementSibling;
  while (current) {
    if (current.tagName !== 'SCRIPT') chunks.push(clean(current));
    current = current.nextElementSibling;
  }
  return chunks.join('\n');
}
