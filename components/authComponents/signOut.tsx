import { useAuthStore } from "@/store/authStore";
import { signOut } from "next-auth/react";

function LogoutButton() {
  const clearUser = useAuthStore((state) => state.clearUser);

  const handleLogout = async () => {
    await signOut();
    clearUser();
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;