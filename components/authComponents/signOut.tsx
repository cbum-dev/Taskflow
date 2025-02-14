import { useAuthStore } from "@/store/authStore";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import {  getSession } from "next-auth/react";

function LogoutButton() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const setUser = useAuthStore((state) => state.setUser);

  const storeUser = (session, setUser) => {
    if (session) {
      const { id, name, email,image } = session.user;
      const access_token = session.access_token;
  
      console.log("Storing user:", { id, name, email,image }, access_token);
  
      setUser({ id, name, email,image }, access_token);
    } else {
      console.error("No session data available to store");
    }
  };
  

  const handleLogout = async () => {
    await signOut();
    clearUser();
  };
  const handleStoreUser = async () => {
    try {
      const session = await getSession();
      console.log(session, "Session Data");

      if (session) {
        storeUser(session, setUser);
      } else {
        console.error("No session data available to store");
      }
    } catch (error) {
      console.error("Error fetching session data:", error.message);
    }
  };

  return <div>
          <Button onClick={handleStoreUser} variant="outline">
        Store in Zustand
      </Button>
    <Button onClick={handleLogout}>
Logout
    </Button>
    Logout
    </div>;
}

export default LogoutButton;