"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  ChevronDownIcon,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from '@/store/authStore'


function Navbar() {
    const { user } = useAuthStore()

  return (
    <nav className="flex items-center h-14 justify-between px-6 py-3 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          TaskFlow
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2">
            <span>Projects</span>
            <ChevronDownIcon className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Project 1</DropdownMenuItem>
            <DropdownMenuItem>Project 2</DropdownMenuItem>
            <DropdownMenuItem>New Project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center space-x-2">
            <span>Filters</span>
            <ChevronDownIcon className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Recent Filters</DropdownMenuItem>
            <DropdownMenuItem>Saved Filters</DropdownMenuItem>
          </DropdownMenuContent>
          <Button variant="default">Create</Button>
        </DropdownMenu>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden sm:flex">
          <Input placeholder="Search" className="w-64 sm:w-60" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src={user?.image} alt="User" />
              <AvatarFallback>{user?.name.charAt(0) || "UK"}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>


          <DropdownMenuContent align="end">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}

export default Navbar;
