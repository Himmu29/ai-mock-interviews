"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts"

interface CategoryScore {
  name: string
  score: number
}

interface FeedbackData {
  categoryScores: CategoryScore[]
}

interface CategoryBreakdownProps {
  feedbackData: FeedbackData[]
}

interface CategoryAverage {
  total: number
  count: number
}

export default function CategoryBreakdown({ feedbackData }: CategoryBreakdownProps) {
  // Calculate average scores for each category
  const categoryAverages: Record<string, CategoryAverage> = {}

  feedbackData.forEach((feedback) => {
    feedback.categoryScores.forEach((category) => {
      if (!categoryAverages[category.name]) {
        categoryAverages[category.name] = { total: 0, count: 0 }
      }
      categoryAverages[category.name].total += category.score
      categoryAverages[category.name].count += 1
    })
  })

  const chartData = Object.entries(categoryAverages).map(([name, data]) => ({
    name,
    score: Math.round(data.total / data.count),
  }))

  // Get latest interview data for radar chart
  const latestFeedback = feedbackData[0]
  const latestData = latestFeedback
    ? latestFeedback.categoryScores.map((category) => ({
        name: category.name,
        score: category.score,
      }))
    : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Tabs defaultValue="bar">
          <TabsList className="mb-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="radar">Radar Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="bar" className="h-[350px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#3b82f6" name="Average Score" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No category data available</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="radar" className="h-[350px]">
            {latestData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={150} data={latestData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Latest Interview" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No category data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
