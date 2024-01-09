export function generateToken(length = 32) {
  const CHARSETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  let token = ''

  for (let i = 0; i < length; i++) {
    token += CHARSETS.charAt(Math.floor(Math.random() * CHARSETS.length))
  }

  return token
}
