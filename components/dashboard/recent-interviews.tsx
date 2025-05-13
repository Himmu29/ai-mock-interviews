"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Award } from "lucide-react"
import Link from "next/link"

interface RecentInterviewsProps {
  interviews: any[]
  feedbackData: any[]
}

export default function RecentInterviews({ interviews, feedbackData }: RecentInterviewsProps) {
  // Create a map of interview IDs to their feedback scores
  const interviewScores = {}
  feedbackData.forEach((feedback) => {
    interviewScores[feedback.interviewId] = feedback.totalScore
  })

  // Get the 5 most recent interviews
  const recentInterviews = interviews.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Interviews</CardTitle>
        <Link href="/interviews" className="text-sm text-blue-600 hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {recentInterviews.length > 0 ? (
          <div className="space-y-4">
            {recentInterviews.map((interview, index) => {
              const date = new Date(interview.createdAt)
              const formattedDate = date.toLocaleDateString()
              const score = interviewScores[interview.id]

              return (
                <Link key={index} href={`/interviews/${interview.id}`} className="block">
                  <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{interview.role || "Interview"}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                      {score !== undefined && (
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1 text-blue-600" />
                          <span className="font-medium">{score}/100</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {interview.techStack &&
                        interview.techStack.map((tech, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      {interview.level && (
                        <Badge variant="outline" className="text-xs">
                          {interview.level}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-6">No interviews yet</p>
        )}
      </CardContent>
    </Card>
  )
}
