import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h2 className="text-4xl font-bold mb-4">404</h2>
        <p className="text-xl mb-6">Page Not Found</p>
        <Link href="/">
          <Button className="bg-green-500 hover:bg-green-600">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
