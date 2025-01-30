'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { HomeIcon, InboxIcon, MoreHorizontalIcon, PlusIcon, SearchIcon, ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside className={`h-[91vh] flex flex-col bg-white border-r transition-all fixed left-0  bottom-0 duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/profile.jpg" alt="User" />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
              <span className="font-medium">Harshit Dan...</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          <ChevronLeftIcon className={`w-5 h-5 transform ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      {!isCollapsed && (
        <ScrollArea className="flex-1 p-">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <HomeIcon className="w-5 h-5 mr-2" /> Home
            </Button>
            <Button variant="ghost" className="w-full justify-start relative">
              <InboxIcon className="w-5 h-5 mr-2" /> Inbox
              <span className="absolute right-4 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <MoreHorizontalIcon className="w-5 h-5 mr-2" /> More
            </Button>
          </nav>
          <Separator className="my-4" />
          <div className="text-sm font-medium text-gray-500 mb-2 ml-2">Favorites</div>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">Everything</Button>
            <Button variant="ghost" className="w-full justify-start">Team Space</Button>
            <Button variant="ghost" className="w-full justify-start">Design Team - I</Button>
            <Button variant="secondary" className="w-full justify-start bg-purple-100 text-purple-700">
              Priyanshu Tasks <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">7</span>
            </Button>
          </nav>
          <Separator className="my-4" />
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">All Projects</Button>
            <Button variant="ghost" className="w-full justify-start">View all Spaces</Button>
            <Button variant="ghost" className="w-full justify-start">
              <PlusIcon className="w-5 h-5 mr-2" /> Create Space
            </Button>
          </nav>
        </ScrollArea>
      )}
      <div className="p-4 border-t flex items-center justify-between">
        {!isCollapsed && <Button variant="ghost">Invite</Button>}
        {!isCollapsed && <Button variant="ghost">Help</Button>}
      </div>
    </aside>
  )
}
