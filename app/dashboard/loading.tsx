import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-24 w-full mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>

      <Skeleton className="h-96 w-full mt-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    </div>
  )
}
