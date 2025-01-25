"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import CounterComponent from "@/components/authComponents/counterCOmponent";

function Page() {
  const user = useAuthStore((state) => state.user);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); 
  }, []);

  if (!hydrated) return null; 

  return (
    <div className="mx-auto my-auto">
      <CounterComponent/>
      {user ? <div>{user.name}</div> : <div>No user data</div>}
    </div>
  );
}

export default Page;
