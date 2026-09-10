/**
 * A sheet is pinned below the masthead strip. The spacer that follows it in the
 * document buys scroll distance: while the reader travels through the spacer the
 * sheet holds position and its content column slides up by exactly its own
 * overflow. When the column bottoms out the spacer ends and the next sheet slides
 * over the top.
 */

export function overflowOf(contentHeight: number, viewportHeight: number): number {
  return Math.max(0, contentHeight - viewportHeight);
}

export function pinAmount(spacerTop: number, viewportHeight: number, overflow: number): number {
  if (overflow <= 0) return 0;
  return Math.max(0, Math.min(overflow, viewportHeight - spacerTop));
}
