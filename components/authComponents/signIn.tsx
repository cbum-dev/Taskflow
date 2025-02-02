import { useAuthStore } from "@/store/authStore";
import { signIn, getSession } from "next-auth/react";
import { Button } from "../ui/button";

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
    } catch (error) {
      console.error("Error during login:", error.message);
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
    } catch (error) {
      console.error("Error fetching session data:", error.message);
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
