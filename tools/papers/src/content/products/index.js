// Maps each character to their ordered product list.
// Only Mina's first product exists in Chunk 2; the rest arrive in Chunk 8.

import minaSpeaker from './mina-speaker.js';
import minaBuds from './mina-buds.js';
import minaLamp from './mina-lamp.js';
import leoMicroDrone from './leo-microdrone.js';
import leoRcCar from './leo-rccar.js';
import leoCameraDrone from './leo-cameradrone.js';
import samiraComposter from './samira-composter.js';
import samiraBottle from './samira-bottle.js';
import samiraCooker from './samira-cooker.js';

export const PRODUCTS = {
  mina: [minaSpeaker, minaBuds, minaLamp],
  leo: [leoMicroDrone, leoRcCar, leoCameraDrone],
  samira: [samiraComposter, samiraBottle, samiraCooker]
};

// The product definition for a given character + index, or null.
export function getProductDef(characterId, index) {
  return (PRODUCTS[characterId] || [])[index] || null;
}
