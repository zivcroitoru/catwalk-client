/*-----------------------------------------------------------------------------
  mailbox.js
-----------------------------------------------------------------------------*/
import { $ } from '../../core/utils.js';

export function toggleMailbox() {
  const mailboxDisplay = document.getElementById('mailboxDisplay');
  mailboxDisplay.classList.toggle('show');
}