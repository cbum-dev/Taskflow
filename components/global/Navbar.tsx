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
import { ChevronDownIcon, Search, Menu } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "next-auth/react";

function Navbar() {
  const { user, clearUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    clearUser();
    window.location.href = "/api/auth/login"; 
  };

  return (
    <nav className="flex fixed backdrop-blur-sm top-0 z-1000 w-full items-center h-14 justify-between px-6 py-3 border-b shadow-sm">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-xl font-bold">
          TaskFlow
        </Link>

            <div className="hidden md:flex items-center space-x-4 ml-10">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <span>Products</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Task Management</DropdownMenuItem>
                  <DropdownMenuItem>Team Collaboration</DropdownMenuItem>
                  <DropdownMenuItem>Project Tracking</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Pricing
              </Link>
              
              <Link href="/enterprise" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                Enterprise
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64"
              />
            </div>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/api/auth/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/api/auth/login">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/products"
              className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Products
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/enterprise"
              className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Enterprise
            </Link>
            {!user && (
              <>
                <Link href="/api/auth/login">
                  <Button variant="ghost" className="w-full justify-start">
                    Log in
                  </Button>
                </Link>
                <Link href="/api/auth/login">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;