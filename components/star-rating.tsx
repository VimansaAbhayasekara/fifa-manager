import { Star, StarHalf } from "lucide-react"

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => {
        const starValue = i + 1

        if (starValue <= rating) {
          return <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        } else if (starValue - 0.5 <= rating) {
          return <StarHalf key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        } else {
          return <Star key={i} className="w-4 h-4 text-slate-600" />
        }
      })}
    </div>
  )
}
