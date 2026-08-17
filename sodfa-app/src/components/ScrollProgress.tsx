"use client";

import React from "react";

export default function ScrollProgress({ progress }: { progress: number }) {
  return (
    <div
      id="progress"
      style={{ width: `${progress}%` }}
      data-page="scrollProgress"
    />
  );
}
