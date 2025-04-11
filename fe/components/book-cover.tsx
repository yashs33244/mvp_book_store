import { BookOpen } from "lucide-react";

interface BookCoverProps {
  title: string;
  author: string;
  genre?: string;
  imageUrl?: string;
}

export function BookCover({ title, author, genre, imageUrl }: BookCoverProps) {
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
    };

    return genre && genreStyles[genre]
      ? genreStyles[genre]
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div
      className={`aspect-[2/3] rounded-md border-2 flex flex-col ${getStyleByGenre(
        genre
      )}`}
    >
      {imageUrl ? (
        <div className="flex-1 overflow-hidden">
          <img
            src={imageUrl}
            alt={`${title} by ${author}`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <BookOpen className="h-12 w-12 opacity-70" />
        </div>
      )}
    </div>
  );
}
