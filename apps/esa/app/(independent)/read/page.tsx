"use client";

import { useEffect } from "react";

export default function ReadRedirectPage() {
  useEffect(() => {
    window.location.replace("/reading");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-600">
      正在跳转到阅读花园...
    </div>
  );
}
