"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ImprovementAreasProps {
  feedbackData: any[]
}

export default function ImprovementAreas({ feedbackData }: ImprovementAreasProps) {
  // Extract all areas for improvement
  const allAreas = feedbackData.flatMap((feedback) => feedback.areasForImprovement || [])

  // Count occurrences of each area
  const areaFrequency = {}
  allAreas.forEach((area) => {
    const normalizedArea = area.trim().toLowerCase()
    areaFrequency[normalizedArea] = (areaFrequency[normalizedArea] || 0) + 1
  })

  // Sort by frequency (most common first)
  const sortedAreas = Object.entries(areaFrequency)
    .sort(([, countA], [, countB]) => (countB as number) - (countA as number))
    .map(([area, count]) => ({
      area: area.charAt(0).toUpperCase() + area.slice(1),
      count,
    }))

  // Get the most recent areas for improvement
  const latestFeedback = feedbackData[0]
  const latestAreas = latestFeedback ? latestFeedback.areasForImprovement || [] : []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Areas for Improvement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Most Common Areas</h3>
            {sortedAreas.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sortedAreas.slice(0, 5).map((item, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <span>{item.area}</span>
                    <span className="bg-gray-200 text-gray-700 text-xs px-1.5 py-0.5 rounded-full">{item.count}</span>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No improvement areas identified yet</p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Latest Feedback</h3>
            {latestAreas.length > 0 ? (
              <ul className="space-y-2">
                {latestAreas.map((area, index) => (
                  <li key={index} className="bg-black p-3 rounded-md text-sm">
                    {area}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No recent feedback available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
