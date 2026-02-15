"use client";

import { useEffect, useState } from "react";

export default function ReadingPage() {
  const [height, setHeight] = useState("calc(100vh - 64px - 300px)"); // Initial guess

  useEffect(() => {
    // Adjust height to fit the window minus header/footer
    const updateHeight = () => {
      const headerHeight = 64;
      // Footer is variable, but let's just make it fill viewport for now or a bit less
      setHeight(`calc(100vh - ${headerHeight}px)`);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div className="w-full h-full bg-gray-50">
      <iframe
        src="/reading-legacy/index.html"
        title="Reading Garden"
        className="w-full border-0"
        style={{ height }}
      />
    </div>
  );
}
