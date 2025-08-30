"use client"

import { toast } from "sonner"
import api from "@/services/api"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Page() {
  const [user, setUser] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/user");
        console.log(response)

        setUser(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (error) {
        toast("Failed to fetch users");
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);



  return (
    <div>
      <h1>User List</h1>
      <ul>
        {user.map((u) => (
          <li key={u.id}>{u.email}</li>
        ))}
      </ul>    <Button
        className="mt-14"
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
    </div>

  )
}
