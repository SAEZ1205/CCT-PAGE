import template from './site-template.html?raw';

const parsed = new DOMParser().parseFromString(template, 'text/html');

function sanitize(node: Element): string {
  const clone = node.cloneNode(true) as Element;
  clone.querySelectorAll('script').forEach((script) => script.remove());
  [clone, ...Array.from(clone.querySelectorAll('*'))].forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      if (/^on/i.test(attribute.name)) element.removeAttribute(attribute.name);
    });
  });
  return clone.outerHTML;
}

export function extractView(view: string): string {
  const node = parsed.querySelector(`[data-view="${view}"]`);
  return node ? sanitize(node) : '';
}

export function extractHeader(): string {
  const node = parsed.querySelector('header#mainHeader');
  return node ? sanitize(node) : '';
}

export function extractFooter(): string {
  const node = parsed.querySelector('footer.footer');
  return node ? sanitize(node) : '';
}
