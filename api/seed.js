import { readBlob, writeBlob } from './_blobStore.js';
import seedProjects from '../data/projects.json' assert { type: 'json' };
import seedPosts from '../data/posts.json' assert { type: 'json' };

export default async function handler(req, res) {
  if (!process.env.ADMIN_PASSWORD || req.query.key !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const existingProjects = await readBlob('data/projects.json', null);
  const existingPosts = await readBlob('data/posts.json', null);

  let seededProjects = false;
  let seededPosts = false;

  if (!existingProjects) {
    const withIds = seedProjects.map((p, i) => ({ id: `seed-${i}`, ...p }));
    await writeBlob('data/projects.json', withIds);
    seededProjects = true;
  }

  if (!existingPosts) {
    await writeBlob('data/posts.json', seedPosts);
    seededPosts = true;
  }

  return res.status(200).json({
    seededProjects,
    seededPosts,
    note: 'Seed complete',
  });
}
