// Mid-development interactive notifications: the "real time" seam. Rather than
// everything happening only when you click "advance," a partner offer, an
// eager fan, or a shady broker can interrupt whatever phase you're on. Each
// fires at most once per game and is spaced out by a cooldown so it reads as
// ambient, not a wall of pop-ups.
//
// Called from engine/phases.js at phase entry and after any HUD-affecting
// action (test run, design change, etc.) — see repaintHud/paint there.

import { state, save } from '../state.js';
import { logLedger } from './events.js';
import { NOTIFICATIONS } from '../content/notifications.js';
import { showPopup } from '../ui/popup.js';

const COOLDOWN_DAYS = 6;
const CHANCE = 0.4;

function buildCtx(character) {
  return {
    character,
    companyName: character.company,
    productName: state.product?.name || 'the product',
    spend(amount, label) {
      state.budget -= amount;
      logLedger(label || 'Notification', -amount);
    },
    earn(amount, label) {
      state.budget += amount;
      logLedger(label || 'Notification', amount);
    },
    reputation(delta) {
      state.reputation = Math.max(0, state.reputation + delta);
    }
  };
}

// Returns true if a popup was shown. `onResolved` runs after the player picks
// a choice (effects already applied), so the caller can refresh its HUD.
export function maybeTrigger(character, onResolved) {
  if (!state.product || state.bankrupt) return false;
  if (state.clock.day - (state.lastNotifyDay ?? -999) < COOLDOWN_DAYS) return false;

  const eligible = NOTIFICATIONS.filter(n =>
    !state.seenNotifications.includes(n.id) && state.clock.day >= (n.minDay || 0));
  if (!eligible.length || Math.random() > CHANCE) return false;

  const totalWeight = eligible.reduce((sum, n) => sum + (n.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  let picked = eligible[eligible.length - 1];
  for (const n of eligible) {
    roll -= (n.weight || 1);
    if (roll <= 0) { picked = n; break; }
  }

  state.lastNotifyDay = state.clock.day;
  state.seenNotifications.push(picked.id);
  save();

  const ctx = buildCtx(character);
  showPopup({
    name: typeof picked.from === 'function' ? picked.from(ctx) : picked.from,
    role: picked.role,
    text: typeof picked.text === 'function' ? picked.text(ctx) : picked.text,
    choices: picked.choices.map(c => ({
      label: c.label,
      hint: c.hint,
      onSelect: () => {
        c.effects(ctx);
        save();
        onResolved && onResolved();
      }
    }))
  });
  return true;
}
