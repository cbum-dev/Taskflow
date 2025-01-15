// pages/api/get-jwt.js

import { getSession } from 'next-auth/react';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Get the user session
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Define payload
  const payload = {
    sub: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  // Sign the JWT
  const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET, {
    expiresIn: '30d', 
  });

  return res.status(200).json({ token });
}
