
/*-----------------------------------------------------------------------------
  mailbox.js
-----------------------------------------------------------------------------*/
import { $ } from '../../core/utils.js';
export function toggleMailbox() {
  const box = $("mailbox");
  box.style.display = box.style.display === "block" ? "none" : "block";
}