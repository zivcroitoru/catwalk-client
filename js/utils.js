/*-----------------------------------------------------------------------------
  utils.js
-----------------------------------------------------------------------------*/
export const $ = id => document.getElementById(id);
export const $$ = selector => document.querySelectorAll(selector);
export function setDisplay(el, visible, type = 'block') {
  if (typeof el === 'string') el = $(el);
  if (el) el.style.display = visible ? type : 'none';
}
