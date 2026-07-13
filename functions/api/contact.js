/**
 * Cloudflare Pages Function — contact form handler.
 * Route: POST /api/contact  (file-based routing: functions/api/contact.js)
 *
 * Sends the submitted message to CONTACT_TO via the Resend HTTP API.
 * Required environment variables (set in the Pages dashboard, NOT in the repo):
 *   RESEND_API_KEY  — a Resend API key with "Sending" access (mark as a secret)
 *   CONTACT_TO      — the inbox that should receive messages (e.g. your real email)
 * Optional:
 *   CONTACT_FROM    — verified sender; defaults to a send.contrapaul.com address
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const message = String(data.message || '').trim();
  const honeypot = String(data.company || '').trim();

  /* Bot filled the hidden field — pretend success, send nothing. */
  if (honeypot) return json({ ok: true });

  if (!name || !email || !message) {
    return json({ error: 'Please fill in all fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'Please enter a valid email address.' }, 400);
  }
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return json({ error: 'One of the fields is too long.' }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO) {
    return json({ error: 'Email is not configured yet.' }, 500);
  }

  const from = env.CONTACT_FROM || 'contrapaul edu <contact@send.contrapaul.com>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject: `Contact form — ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html:
        `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return json({ error: 'Could not send your message. Please use the email link.', detail }, 502);
  }

  return json({ ok: true });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}
