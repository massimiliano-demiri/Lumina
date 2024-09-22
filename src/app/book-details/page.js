"use client";

import React, { Suspense } from "react";
import BookDetailsComponent from "./BookDetailsComponent";

export default function BookDetailsPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <BookDetailsComponent />
    </Suspense>
  );
}
