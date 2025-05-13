"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BadgeCheck, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

interface PerformanceOverviewProps {
  feedbackData: any[]
}

export default function PerformanceOverview({ feedbackData }: PerformanceOverviewProps) {
  // Calculate average total score
  const totalScores = feedbackData.map((feedback) => feedback.totalScore)
  const averageScore =
    totalScores.length > 0 ? Math.round(totalScores.reduce((sum, score) => sum + score, 0) / totalScores.length) : 0

  // Calculate score trend (comparing latest with previous)
  const latestScore = totalScores[0] || 0
  const previousScore = totalScores[1] || 0
  const scoreDifference = latestScore - previousScore
  const isImproving = scoreDifference >= 0

  // Count total interviews
  const totalInterviews = feedbackData.length

  // Get best category
  const categoryAverages = {}

  feedbackData.forEach((feedback) => {
    feedback.categoryScores.forEach((category) => {
      if (!categoryAverages[category.name]) {
        categoryAverages[category.name] = { total: 0, count: 0 }
      }
      categoryAverages[category.name].total += category.score
      categoryAverages[category.name].count += 1
    })
  })

  let bestCategory = { name: "N/A", average: 0 }

  Object.entries(categoryAverages).forEach(([name, data]: [string, any]) => {
    const average = data.total / data.count
    if (average > bestCategory.average) {
      bestCategory = { name, average: Math.round(average) }
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Average Score</span>
              <span className="text-2xl font-bold">{averageScore}/100</span>
            </div>
            <Progress value={averageScore} className="h-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Interviews</span>
                <BarChart3 className="h-4 w-4 text-gray-600" />
              </div>
              <p className="text-2xl text-black font-bold mt-2">{totalInterviews}</p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Trend</span>
                {isImproving ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
              <p className={`text-2xl font-bold mt-2 ${isImproving ? "text-green-600" : "text-red-600"}`}>
                {isImproving ? "+" : ""}
                {scoreDifference || "N/A"}
              </p>
            </div>

            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Best Category</span>
                <BadgeCheck className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-lg text black font-bold mt-2 truncate" title={bestCategory.name}>
                {bestCategory.name}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
