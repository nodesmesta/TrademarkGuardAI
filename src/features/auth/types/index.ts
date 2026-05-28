export interface User {
  id: string
  email: string
  name: string
  lastLogin?: string
  verified?: boolean
  created_at?: string
  createdAt?: Date
}
export interface PinSession {
  email: string
  pin: string
  createdAt: Date
  expiresAt: Date
}
export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: string
  created_at: string
  is_active: boolean
}
export interface AuthToken {
  token: string
  expiresAt: Date
  user: User
}
export interface AuthError {
  code: string
  message: string
  details?: string
}
export type AuthErrorCode =
  | 'INVALID_EMAIL'
  | 'MISSING_CREDENTIALS'
  | 'PIN_SESSION_EXPIRED'
  | 'INVALID_PIN'
  | 'PIN_EXPIRED'
  | 'USER_EXISTS'
  | 'SEND_PIN_FAILED'
  | 'VERIFY_PIN_FAILED'
  | 'SIGNUP_FAILED'
  | 'INTERNAL_ERROR'
export interface SendPinResult {
  success: boolean
  data?: {
    message: string
  }
  error?: AuthError
}
export interface VerifyPinResult {
  success: boolean
  data?: {
    user: User
    token: string
    message: string
  }
  error?: AuthError
}
export interface SignUpResult {
  success: boolean
  data?: {
    user: User
    message: string
  }
  error?: AuthError
}
export interface SendPinRequest {
  email: string
}
export interface VerifyPinRequest {
  email: string
  pin: string
}
export interface SignupRequest {
  email: string
  name: string
}
export interface IEmailService {
  sendPinEmail(email: string, pin: string): Promise<void>
  sendWelcomeEmail(email: string, name: string): Promise<void>
}
export interface IAuthService {
  sendPin(email: string): Promise<SendPinResult>
  verifyPin(email: string, pin: string): Promise<VerifyPinResult>
  signUp(email: string, name?: string): Promise<SignUpResult>
}
export interface AuthConfig {
  demoMode: boolean
  pinExpiryMinutes: number
  tokenExpiryHours: number
}
