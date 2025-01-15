// pages/index.js
"use client"
import { useSession, signIn, signOut } from 'next-auth/react';
import axios from 'axios';
import { fetchJwtToken } from './utils/fetch-jwt';

export default function Home() {
  const { data: session, status } = useSession();

  const fetchProtectedData = async () => {
    if (!session) {
      alert('Not authenticated');
      return;
    }

    try {
      // Fetch the custom JWT token
      const jwtToken = await fetchJwtToken();

      // Make the authenticated request to Express backend
      const res = await axios.get('http://localhost:3001/api/user/', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log('Protected Data:', res.data);
      alert(JSON.stringify(res.data));
    } catch (error) {
      console.error('Error fetching protected data:', error.response?.data || error.message);
      alert('Error fetching protected data');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      {session ? (
        <>
          <p>Signed in as {session.user.email}</p>
          <button onClick={() => signOut()} style={{ marginRight: '1rem' }}>
            Sign out
          </button>
          <button onClick={fetchProtectedData}>Fetch Protected Data</button>
        </>
      ) : (
        <>
          <p>Not signed in</p>
          <button onClick={() => signIn('google')}>Sign in with Google</button>
        </>
      )}
    </div>
  );
}
