import { decryptString, encryptString } from '@47ng/cloak'
import { env } from './env'

export const escapeLike = (s: string) => s.replace(/([\\%_])/g, '\\$1')

export async function encrypt(plaintext: string): Promise<string> {
  return await encryptString(plaintext, env.ENCRYPTION_KEY)
}

export async function decrypt(ciphertext: string): Promise<string> {
  const decrypted = await decryptString(ciphertext, env.ENCRYPTION_KEY)
  return decrypted
}
