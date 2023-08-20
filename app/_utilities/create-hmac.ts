const createHmac = async (key: string, content: string) => {
  const encoder = new TextEncoder();

  return Array.from(
    new Uint8Array(
      await crypto.subtle.sign(
        'HMAC',
        await crypto.subtle.importKey(
          'raw',
          encoder.encode(key),
          { hash: 'SHA-256', name: 'HMAC' },
          false,
          ['sign'],
        ),
        encoder.encode(content),
      ),
    ),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

export default createHmac;
