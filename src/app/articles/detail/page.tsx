"use client";

import React, { Suspense } from "react";
import ArticleClient from "./ArticleClient";

export default function ArticleDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-400">Loading...</p>
        </div>
      </div>
    }>
      <ArticleClient />
    </Suspense>
  );
}
