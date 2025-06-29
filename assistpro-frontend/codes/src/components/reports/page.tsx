// reports/page.tsx

"use client";

import React from "react";

export default function ReportsPage() {
  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <button onClick={handleClick}>Click me</button>
  );
}
