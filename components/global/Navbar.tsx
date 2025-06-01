"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "next-auth/react";


function Navbar() {
  const { user, clearUser } = useAuthStore();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    clearUser();
    window.location.href = "/api/auth/login"; 
  };

  return (
    <nav className="flex fixed backdrop-blur-sm top-0 z-[1000] w-full items-center h-14 justify-between px-6 py-3 border-b shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          TaskFlow
        </Link>
        <Link href="/workspace/list">
          <Button variant="outline">My Workspaces</Button>
          </Link>
          <Link href="/workspace/create">
          <Button variant="default">Create Workspace</Button>
          </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex">
          <Input placeholder="Search" className="w-64 sm:w-60" />
        </div>
        {user ? (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Avatar>
        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>

    <DropdownMenuContent className="z-[10000]" align="end">
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuItem onClick={handleLogout} className="text-red-500">
        Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
) : (
  <Button variant="default">
  <Link href="/api/auth/login">Login</Link>  </Button>
)}

        
      </div>
    </nav>
  );
}

export default Navbar;
