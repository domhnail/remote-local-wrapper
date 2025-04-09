import { nanoid } from 'nanoid';
import { setSession } from '@/app/lib/sessionStore';

export async function POST(req) {
  const { privateKey, passphrase } = await req.json();

  if (!privateKey || !passphrase) {
    return Response.json({ error: "Missing private key or passphrase" }, { status: 400 });
  }

  const token = nanoid();
  setSession(token, { privateKey, passphrase });

  return Response.json({ token }, { status: 200 });
}