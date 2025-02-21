import { useAuthStore } from "@/store/authStore";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import {  getSession } from "next-auth/react";
import { Session } from "next-auth";

type SetUserFn = (user: { id: string; name: string; email: string; image?: string }, token: string) => void;

function LogoutButton() {
  const clearUser = useAuthStore((state) => state.clearUser);
  const setUser = useAuthStore((state) => state.setUser);

  const storeUser = (session: Session, setUser: SetUserFn) => {
    if (session?.user?.id && session?.user?.name && session?.user?.email && session?.accessToken) {
      const { id, name, email, image } = session.user;
      const access_token = session.accessToken;

      setUser({ 
        id: id as string,
        name: name as string,
        email: email as string,
        image: image || undefined 
      }, access_token);
    } else {
      console.error("Missing required session data");
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
    } catch (error:unknown) {
      if (error instanceof Error) {
        console.error("Error during login:", error.message);
      } else {
        console.error("Unknown error during login");
      }
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