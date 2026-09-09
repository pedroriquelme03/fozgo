import * as Crypto from 'expo-crypto';

function toHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function newSalt() {
  return toHex(await Crypto.getRandomBytesAsync(16));
}

export async function hashPassword(password: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

export async function passwordsMatch(password: string, salt: string, hash: string) {
  const next = await hashPassword(password, salt);
  return next === hash;
}
