"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from 'next-auth/react';


function Page() {
  const [users, setUsers] = useState([]);
    const { data: session, status } = useSession();
  console.log(session?.user?.email)
  const searchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/user");
      console.log("Error fetching users:", response.data.data);

      setUsers(response.data.data); // Ensure you access the correct structure
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    searchUser(); // Fetch data on component mount
  }, []);

  return (
    <div>
      {users.map((user, index) => (
        <div key={index}>
          <h3>{user.name}</h3>
          <p>{user.id}</p>
        </div>
      ))}
    </div>
  );
}

export default Page;
