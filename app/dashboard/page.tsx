import { getInterviewsByUserId, getFeedbackByInterviewId } from "@/lib/actions/general.action"
import { auth } from "@/firebase/admin"
import { cookies } from "next/headers"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import PerformanceOverview from "@/components/dashboard/performance-overview"
import CategoryBreakdown from "@/components/dashboard/category-breakdown"
import ImprovementAreas from "@/components/dashboard/improvement-areas"
import RecentInterviews from "@/components/dashboard/recent-interviews"
import PerformanceTrend from "@/components/dashboard/performance-trend"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')?.value
  
  if (!sessionCookie) {
    redirect("/login")
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true)
    const user = await auth.getUser(decodedClaims.uid)
    const userId = user.uid

    // Fetch all interviews for the user
    const interviews = await getInterviewsByUserId(userId)

    if (!interviews || interviews.length === 0) {
      return (
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader />
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Interview Data Yet</h2>
            <p className="text-gray-600 mb-6">Complete your first interview to see your performance analytics.</p>
            <a
              href="/interviews/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Start an Interview
            </a>
          </div>
        </div>
      )
    }

    // Fetch feedback for each interview
    const feedbackPromises = interviews.map((interview) =>
      getFeedbackByInterviewId({ interviewId: interview.id, userId }),
    )

    const feedbackResults = await Promise.all(feedbackPromises)
    const feedbackData = feedbackResults.filter((feedback) => feedback !== null)

    return (
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <PerformanceOverview feedbackData={feedbackData} />
          <PerformanceTrend feedbackData={feedbackData} interviews={interviews} />
        </div>

        <div className="mt-8">
          <CategoryBreakdown feedbackData={feedbackData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <ImprovementAreas feedbackData={feedbackData} />
          <RecentInterviews interviews={interviews} feedbackData={feedbackData} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in Dashboard component:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">There was an error loading your dashboard. Please try again later.</p>
        </div>
      </div>
    )
  }
}
