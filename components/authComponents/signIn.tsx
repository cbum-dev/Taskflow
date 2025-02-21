import { useAuthStore } from "@/store/authStore";
import { signIn, getSession } from "next-auth/react";
import { Session } from "next-auth";
import { Button } from "../ui/button";

type SetUserFn = (user: { id: string; name: string; email: string; image?: string }, token: string) => void;

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

function LoginButton() {
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async () => {
    try {
      const res = await signIn("google", { redirect: false });
      console.log(res, "signIn response");

      if (res && res.ok) {
        console.log("Sign-in successful. Fetching session...");
      } else {
        console.error("Login failed or was cancelled by the user");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during login:", error.message);
      } else {
        console.error("Unknown error during login");
      }
    }
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error fetching session data:", error.message);
      } else {
        console.error("Unknown error fetching session");
      }
    }
  };

  return (
    <div>
      <Button onClick={handleLogin}>Login with Google</Button>
      
      <Button onClick={handleStoreUser} variant="outline">
        Store in Zustand
      </Button>
    </div>
  );
}

export default LoginButton;
