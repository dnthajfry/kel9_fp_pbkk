"use client"

import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export function TopBar() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between p-6 pb-0">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search" className="pl-10 bg-white text-black rounded-full border-0" />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback className="bg-slate-600 text-white text-sm">SN</AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          className="text-white font-medium bg-slate-700 hover:bg-slate-800 hover:text-white cursor-pointer"
          onClick={() => router.push("/login")}
        >
          Shabilqis Naila
        </Button>
      </div>
    </div>
  )
}
