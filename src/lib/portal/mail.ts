import { Resend } from 'resend'

/*
 * Magic-link email dispatch. In production we send via Resend using the
 * existing RESEND_API_KEY + PORTAL_MAGIC_LINK_FROM env vars. When those are
 * missing (local dev, first-time preview before secrets are set), we log
 * the link to the server console so Brett can walk through the flow.
 */

export async function sendMagicLink(
  email: string,
  link: string,
  authorName: string,
): Promise<{ ok: true; delivered: 'resend' | 'console' } | { ok: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.PORTAL_MAGIC_LINK_FROM

  if (!apiKey || !from) {
    // Dev fallback — surfaces the link in the deploy logs so Brett can copy
    // it during setup before the secrets land in Vercel.
    // eslint-disable-next-line no-console
    console.log('[portal] Magic link (no Resend configured):', {
      email,
      link,
    })
    return { ok: true, delivered: 'console' }
  }

  const resend = new Resend(apiKey)
  const subject = 'Your PodcastNetwork.org portal link'
  const html = `
    <div style="font-family: -apple-system, system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px; color: #14140f;">
      <h1 style="font-size: 22px; letter-spacing: -0.01em; margin: 0 0 16px 0;">
        Your portal is ready, ${authorName}.
      </h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
        Click the link below to sign in. It works once and expires in 15 minutes.
      </p>
      <p style="margin: 0 0 32px 0;">
        <a href="${link}" style="display: inline-block; background: #ffdd05; color: #14140f; text-decoration: none; font-weight: 600; padding: 14px 22px; border-radius: 12px;">
          Open my portal
        </a>
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #57534e; margin: 0;">
        If you did not request this, ignore the message. Someone typed your
        email into podcastnetwork.org/portal/login/.
      </p>
      <p style="font-size: 13px; line-height: 1.6; color: #57534e; margin: 16px 0 0 0;">
        PodcastNetwork.org · brett@podcastnetwork.org
      </p>
    </div>
  `

  try {
    await resend.emails.send({
      from,
      to: email,
      subject,
      html,
    })
    return { ok: true, delivered: 'resend' }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown Resend error.',
    }
  }
}
