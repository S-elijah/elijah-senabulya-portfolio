import { put, head } from '@vercel/blob';

export async function readBlob(pathname, fallback) {
  try {
    const meta = await head(pathname);
    const res = await fetch(`${meta.url}?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return fallback;
    return await res.json();
  } catch (e) {
    return fallback;
  }
}

export async function writeBlob(pathname, data) {
  await put(pathname, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
  });
}
