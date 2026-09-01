import { readBlob, writeBlob } from './_blobStore.js';

const PATH = 'data/posts.json';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const posts = await readBlob(PATH, []);
    return res.status(200).json(posts);
  }

  const auth = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const posts = await readBlob(PATH, []);
    if (posts.some((p) => p.slug === req.body.slug)) {
      return res.status(400).json({ error: 'Slug already exists' });
    }
    posts.unshift(req.body);
    await writeBlob(PATH, posts);
    return res.status(200).json(req.body);
  }

  if (req.method === 'PUT') {
    const { originalSlug, ...updates } = req.body;
    let posts = await readBlob(PATH, []);
    posts = posts.map((p) => (p.slug === originalSlug ? { ...p, ...updates } : p));
    await writeBlob(PATH, posts);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { slug } = req.body;
    let posts = await readBlob(PATH, []);
    posts = posts.filter((p) => p.slug !== slug);
    await writeBlob(PATH, posts);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
