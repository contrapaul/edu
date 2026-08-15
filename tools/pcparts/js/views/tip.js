/* Places a readout box next to whatever it describes, without letting it fall
 * outside its container.
 *
 * The box lives in the tool rather than inside the plot, because the plot
 * scrolls sideways on narrow screens and `overflow-x: auto` clips vertically
 * as well, which used to cut the top row of points in half.
 *
 * It prefers to sit above the target. If there is no room it flips below, and
 * it always slides back inside the container horizontally, so a point at the
 * left edge opens to the right and into the chart.
 */

const GAP = 14;    // clearance between the box and the point
const EDGE = 8;    // minimum clearance from the container edge
const SIDE = 12;   // clearance when the box opens sideways from the point

export function placeTip(tip, target, container) {
  tip.hidden = false;
  tip.style.transform = 'none';

  const t = target.getBoundingClientRect();
  const c = container.getBoundingClientRect();
  const box = tip.getBoundingClientRect();

  const cx = t.left + t.width / 2 - c.left;
  const top = t.top - c.top;
  const bottom = t.bottom - c.top;

  let y = top - GAP - box.height;
  if (y < EDGE) y = bottom + GAP;
  y = Math.min(y, c.height - box.height - EDGE);
  y = Math.max(y, EDGE);

  // Centred by default. Where centring would run past an edge, the box hangs
  // off the point instead and opens inwards, rather than being nudged along
  // and half covering the axis.
  let x = cx - box.width / 2;
  if (x < EDGE) x = cx + SIDE;
  else if (x + box.width > c.width - EDGE) x = cx - box.width - SIDE;
  x = Math.min(x, c.width - box.width - EDGE);
  x = Math.max(x, EDGE);

  tip.style.left = `${x}px`;
  tip.style.top = `${y}px`;
}

/* A full panel is too tall to sit above its subject, so it goes beside it,
 * on whichever side has room, vertically centred on the target. Keeping it
 * next to the part is what stops the link in its corner being a long trip.
 */
export function placePanel(panel, target, container, gap = 18) {
  panel.hidden = false;

  const t = target.getBoundingClientRect();
  const c = container.getBoundingClientRect();
  const b = panel.getBoundingClientRect();

  const roomRight = c.right - t.right;
  const roomLeft = t.left - c.left;
  const needed = b.width + gap + EDGE;

  let x;
  if (roomRight >= needed) x = t.right - c.left + gap;
  else if (roomLeft >= needed) x = t.left - c.left - b.width - gap;
  else x = (c.width - b.width) / 2;      // no room either side, so centre it
  x = Math.max(EDGE, Math.min(x, c.width - b.width - EDGE));

  let y = t.top + t.height / 2 - c.top - b.height / 2;
  y = Math.max(EDGE, Math.min(y, c.height - b.height - EDGE));

  panel.style.left = `${x}px`;
  panel.style.top = `${y}px`;
}
