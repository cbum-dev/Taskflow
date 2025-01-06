"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";

export default function Component() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);

  const showUsers = () => {
    axios.get("http://localhost:3001/api/user/")
    .then(data => setUsers(data.data))
    .catch(error => console.log(error))
  }

  const postUser = async () => {
    try {
      if (!session?.user?.email || !session?.user?.name) {
        console.error('No user session data available');
        return;
      }
      const response = await fetch("http://127.0.0.1:3001/api/user", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: session.user.name,
          imageUrl: session.user.image
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      console.log('User created:', data);
      
      // Refresh the users list
      showUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <Button onClick={showUsers} variant="default">Show Users</Button>
        <Button onClick={postUser} variant="default">Add Me</Button>
        <button onClick={() => signOut()}>Sign out</button>
        
        {users.length > 0 && (
          <div>
            <h2>Users:</h2>
            <ul>
              {users.map((user: any) => (
                <li key={user.id}>{user.email}</li>
              ))}
            </ul>
          </div>
        )}
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}