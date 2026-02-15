"use client";

import { useEffect, useState } from "react";
import { Loader2, BookOpen } from "lucide-react";

export default function ReadingPage() {
  const [height, setHeight] = useState("calc(100vh - 64px)");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = 80; // floating nav + margin
      setHeight(`calc(100vh - ${headerHeight}px)`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="w-full relative" style={{ height }}>
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 gradient-hero flex flex-col items-center justify-center z-10">
          <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 animate-pulseSoft">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
          <p className="text-sm text-gray-400">正在加载阅读站...</p>
        </div>
      )}

      <iframe
        src="/reading-legacy/index.html"
        title="Reading Garden"
        className="w-full h-full border-0"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
