export default function handler(req, res) {
  const auth = req.headers['x-admin-password'];
  if (process.env.ADMIN_PASSWORD && auth === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
}
