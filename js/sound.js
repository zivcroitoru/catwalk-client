
/*-----------------------------------------------------------------------------
  sound.js
-----------------------------------------------------------------------------*/
import { state } from './state.js';
import { $ } from './utils.js';

export function toggleVolume() {
  const btn = $("volumeBtn");
  const isOn = btn.textContent === "🔊";
  btn.textContent = isOn ? "🔇" : "🔊";
  state.soundOn = !isOn;
}