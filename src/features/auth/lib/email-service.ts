import 'server-only'
import { IEmailService } from '../types'
let ResendClass: any = null;
ResendClass = require('resend').Resend;
export class ResendEmailService implements IEmailService {
  private fromEmail: string
  private resend: any
  constructor(fromEmail: string) {
    this.fromEmail = fromEmail
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY is required')
    }
    this.resend = new ResendClass(apiKey)
  }
  async sendPinEmail(email: string, pin: string): Promise<void> {
      const { error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Your WebDataUnlock PIN Code',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>WebDataUnlock PIN Code</h2>
            <p>Your PIN code for authentication is:</p>
            <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
              <strong>${pin}</strong>
            </div>
            <p>This PIN will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <small>This is an automated message from WebDataUnlock.</small>
          </div>
        `
      })
      if (error) {
        console.error('[RESEND] Failed to send PIN email:', error)
        console.error('[RESEND] Error details:', JSON.stringify(error))
      } else {
        console.log(`[RESEND] PIN email sent to ${email}`)
      }
    }
    async sendWelcomeEmail(email: string, name: string): Promise<void> {
      const { error } = await this.resend.emails.send({
        from: this.fromEmail,
        to: email,
        subject: 'Welcome to WebDataUnlock!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Welcome to WebDataUnlock, ${name}!</h2>
            <p>Thank you for signing up. Your account has been successfully created.</p>
            <p>You can now use your email to sign in with our passwordless authentication system.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <small>This is an automated message from WebDataUnlock.</small>
          </div>
        `
      })
      if (error) {
        console.error('[RESEND] Failed to send welcome email:', error)
      } else {
        console.log(`[RESEND] Welcome email sent to ${email} (${name})`)
      }
      console.error('[RESEND] Exception sending welcome email:', error)
    }
}
export function getEmailService(): IEmailService {
  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'auth@nodesemesta.com'
  if (!resendApiKey) {
    console.warn('[EMAIL SERVICE] RESEND_API_KEY not set  using mock email service (PIN will be logged).')
    class MockEmailService implements IEmailService {
      async sendPinEmail(email: string, pin: string): Promise<void> {
        console.log(`[MOCK EMAIL] PIN for ${email}: ${pin}`)
      }
      async sendWelcomeEmail(email: string, name: string): Promise<void> {
        console.log(`[MOCK EMAIL] Welcome email to ${email} (name: ${name})`)
      }
    }
    return new MockEmailService()
  }
  if (!ResendClass) {
    throw new Error('Resend package not available')
  }
  return new ResendEmailService(fromEmail)
}
