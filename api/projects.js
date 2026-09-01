import { readBlob, writeBlob } from './_blobStore.js';

const PATH = 'data/projects.json';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const projects = await readBlob(PATH, []);
    return res.status(200).json(projects);
  }

  const auth = req.headers['x-admin-password'];
  if (!process.env.ADMIN_PASSWORD || auth !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const projects = await readBlob(PATH, []);
    const item = { id: Date.now().toString(), ...req.body };
    projects.unshift(item);
    await writeBlob(PATH, projects);
    return res.status(200).json(item);
  }

  if (req.method === 'PUT') {
    const { id, ...updates } = req.body;
    let projects = await readBlob(PATH, []);
    projects = projects.map((p) => (p.id === id ? { ...p, ...updates, id } : p));
    await writeBlob(PATH, projects);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body;
    let projects = await readBlob(PATH, []);
    projects = projects.filter((p) => p.id !== id);
    await writeBlob(PATH, projects);
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
