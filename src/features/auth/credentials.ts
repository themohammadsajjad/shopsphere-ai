function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function hashMockPassword(password: string) {
  const encoded = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return bytesToHex(new Uint8Array(digest));
}

export async function verifyMockPassword(
  password: string,
  expectedHash: string,
) {
  const passwordHash = await hashMockPassword(password);

  return passwordHash === expectedHash;
}
