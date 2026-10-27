import { APP_STORE_URL, inviteToken, openAppUrl, readInvite } from './invite-core.js';

const $ = (id) => document.getElementById(id);
const invite = readInvite(location.search, location.hash);

const getButton = $('get-empire');
const openButton = $('open-empire');
getButton.href = APP_STORE_URL;
openButton.href = openAppUrl(invite.code);

if (invite.code) {
  $('headline').textContent = invite.name ? `${invite.name} invited you to Empire` : 'You’re invited to Empire';
  $('code').textContent = invite.code;
  $('manual-code').value = invite.code;
  $('invite-card').hidden = false;
} else {
  $('headline').textContent = 'Build your Empire';
  $('no-invite').hidden = false;
}

async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  field.setSelectionRange(0, text.length);
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  field.remove();
  return copied;
}

getButton.addEventListener('click', async (event) => {
  // Without an invite this is a plain App Store link.
  if (!invite.code) return;
  event.preventDefault();
  if (await copyText(inviteToken(invite.code))) {
    $('copy-status').textContent = 'Invite copied. Opening the App Store…';
    location.href = APP_STORE_URL;
    return;
  }
  // Copy failed: show the code to type in and let the player continue themselves.
  $('copy-failed').hidden = false;
  $('manual-code').focus();
  $('manual-code').select();
});
