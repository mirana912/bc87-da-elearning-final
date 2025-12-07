// src/components/common/CourseImage/CourseImage.tsx
import { useState } from "react";
import { BookOpen } from "lucide-react";

interface CourseImageProps {
  src?: string;
  alt: string;
  className?: string;
}

const PlaceholderImage = ({
  className,
}: {
  alt: string;
  className?: string;
}) => (
  <div
    className={`flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 ${className}`}
  >
    <div className="flex flex-col items-center gap-3 text-gray-400">
      <div className="rounded-full bg-gray-300 p-4">
        <BookOpen className="w-8 h-8 text-gray-500" />
      </div>
      <span className="text-xs font-medium text-gray-500">
        Không có hình ảnh
      </span>
    </div>
  </div>
);

export const CourseImage = ({ src, alt, className = "" }: CourseImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (!src || imageError) {
    return <PlaceholderImage alt={alt} className={className} />;
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};
