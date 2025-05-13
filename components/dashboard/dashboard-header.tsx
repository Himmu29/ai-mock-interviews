import { auth } from "@/firebase/admin"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { cookies } from "next/headers"

export default async function DashboardHeader() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  let userData = null

  if (sessionCookie) {
    try {
      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
      const user = await auth.getUser(decodedClaims.uid)
      userData = {
        name: user.displayName || "User",
        email: user.email,
        image: user.photoURL
      }
    } catch (error) {
      console.error('Error verifying session:', error)
    }
  }

  const initials = userData?.name
    ? userData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <Avatar className="h-16 w-16 mr-4">
              <AvatarImage src={userData?.image || ""} alt={userData?.name || "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{userData?.name || "User"}&apos;s Dashboard</h1>
              <p className="text-gray-500">{userData?.email}</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <a
              href="/interviews/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              New Interview
            </a>
            <a
              href="/settings"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
            >
              Settings
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
