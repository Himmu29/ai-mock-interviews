"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface PerformanceTrendProps {
  feedbackData: any[]
  interviews: any[]
}

export default function PerformanceTrend({ feedbackData, interviews }: PerformanceTrendProps) {
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    // Match feedback with interview dates and prepare chart data
    const data = []

    // Create a map of interview IDs to their dates
    const interviewDates = {}
    interviews.forEach((interview) => {
      interviewDates[interview.id] = new Date(interview.createdAt).toLocaleDateString()
    })

    // Sort feedback by interview date (newest first)
    const sortedFeedback = [...feedbackData].sort((a, b) => {
      const dateA = new Date(interviewDates[a.interviewId] || 0)
      const dateB = new Date(interviewDates[b.interviewId] || 0)
      return dateB.getTime() - dateA.getTime()
    })

    // Reverse to show oldest first in chart
    sortedFeedback.reverse().forEach((feedback) => {
      const date = interviewDates[feedback.interviewId]

      if (date) {
        // Extract category scores
        const categoryScores = {}
        feedback.categoryScores.forEach((category) => {
          categoryScores[category.name.replace(/\s+/g, "")] = category.score
        })

        data.push({
          date,
          totalScore: feedback.totalScore,
          ...categoryScores,
        })
      }
    })

    setChartData(data)
  }, [feedbackData, interviews])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalScore" stroke="#3b82f6" strokeWidth={2} name="Total Score" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">Not enough data to show trends</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
