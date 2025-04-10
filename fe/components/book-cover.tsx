import { BookOpen } from "lucide-react"

interface BookCoverProps {
  title: string
  author: string
  genre?: string
}

export function BookCover({ title, author, genre }: BookCoverProps) {
  // Generate a deterministic grayscale style based on the genre
  const getStyleByGenre = (genre?: string) => {
    const genreStyles: Record<string, string> = {
      fiction: "bg-gray-100 text-gray-800 border-gray-200",
      "non-fiction": "bg-gray-50 text-gray-800 border-gray-200",
      "science-fiction": "bg-gray-200 text-gray-800 border-gray-300",
      fantasy: "bg-gray-100 text-gray-800 border-gray-200",
      mystery: "bg-gray-50 text-gray-800 border-gray-200",
      romance: "bg-gray-100 text-gray-800 border-gray-200",
      biography: "bg-gray-50 text-gray-800 border-gray-200",
      history: "bg-gray-100 text-gray-800 border-gray-200",
      "self-help": "bg-gray-50 text-gray-800 border-gray-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    }

    return genre && genreStyles[genre] ? genreStyles[genre] : "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <div className={`aspect-[2/3] rounded-md border-2 flex flex-col ${getStyleByGenre(genre)}`}>
      <div className="flex-1 flex items-center justify-center p-4">
        <BookOpen className="h-12 w-12 opacity-70" />
      </div>
      <div className="p-3 text-center border-t border-current/20">
        <h3 className="font-serif font-medium text-sm line-clamp-1">{title}</h3>
        <p className="text-xs opacity-80 line-clamp-1 font-sans">{author}</p>
      </div>
    </div>
  )
}
