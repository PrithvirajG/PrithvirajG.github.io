import { overflowOf, pinAmount } from './pin';

interface Bound {
  col: HTMLElement;
  spacer: HTMLElement | null;
  bar: HTMLElement | null;
  overflow: number;
}

export default function start(): void {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const sheets = Array.from(document.querySelectorAll<HTMLElement>('.sheet'));
  if (!sheets.length) return;

  const strip = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--strip'), 10) || 0;
  const lede = document.getElementById('lede');
  const words: HTMLElement[] = [];
  let pinned = matchMedia('(min-width: 821px)').matches;
  let bound: Bound[] = [];

  if (lede) {
    let html = '';
    lede.childNodes.forEach(node => {
      const isKey = node.nodeType === 1 && (node as Element).classList.contains('key');
      html += (node.textContent ?? '').split(/(\s+)/)
        .map(t => (t.trim() ? `<span class="w${isKey ? ' key' : ''}">${t}</span>` : t))
        .join('');
    });
    lede.innerHTML = html;
    words.push(...Array.from(lede.querySelectorAll<HTMLElement>('.w')));
  }

  function layout(): void {
    pinned = matchMedia('(min-width: 821px)').matches;
    const view = innerHeight - strip;
    bound = sheets.map(sheet => {
      const col = sheet.querySelector<HTMLElement>('.col')!;
      const next = sheet.nextElementSibling as HTMLElement | null;
      const spacer = next && next.classList.contains('spacer') ? next : null;
      const overflow = pinned ? overflowOf(col.scrollHeight, view) : 0;
      if (spacer) spacer.style.height = `${overflow}px`;
      if (!pinned) col.style.transform = '';
      return { col, spacer, bar: sheet.querySelector<HTMLElement>('.pin i'), overflow };
    });
  }

  let ticking = false;
  function onScroll(): void {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;

      const mid = innerHeight * .5;
      let current = sheets[0];
      for (const s of sheets) if (s.getBoundingClientRect().top <= mid) current = s;
      const tone = current?.dataset.paper;
      if (tone) document.body.style.backgroundColor = `var(--paper${tone === 'paper' ? '' : '-' + tone})`;

      if (pinned) for (const b of bound) {
        if (!b.overflow || !b.spacer) { if (b.bar) b.bar.style.width = '0'; continue; }
        const amount = pinAmount(b.spacer.getBoundingClientRect().top, innerHeight, b.overflow);
        b.col.style.transform = `translateY(${-amount}px)`;
        if (b.bar) b.bar.style.width = `${(amount / b.overflow) * 100}%`;
      }

      if (lede && words.length) {
        const r = lede.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (innerHeight * .82 - r.top) / (r.height + innerHeight * .28)));
        const n = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < n));
      }
    });
  }

  layout();
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { layout(); onScroll(); });
  if (document.fonts?.ready) document.fonts.ready.then(() => { layout(); onScroll(); });
}
