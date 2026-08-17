"use client";

import React, { useState, useEffect } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`preloader${done ? " done" : ""}`} id="preloader" data-page="preloader">
      <div className="pl-logo">
        <b>ص</b>
      </div>
    </div>
  );
}
