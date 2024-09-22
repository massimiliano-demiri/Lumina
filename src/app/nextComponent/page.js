"use client";

import React, { Suspense } from "react";
import ExcerptComponent from "./ExcerptComponent"; // Assumendo che tu abbia messo il codice di sopra in ExcerptComponent

export default function NextComponentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExcerptComponent />
    </Suspense>
  );
}
