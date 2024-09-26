"use client";

import React, { useEffect } from "react";

const ParallaxEffect = ({ children }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const moveX = (clientX / window.innerWidth - 0.5) * 10;
        const moveY = (clientY / window.innerHeight - 0.5) * 10;

        document.documentElement.style.setProperty(
          "--parallax-x",
          `${moveX}px`
        );
        document.documentElement.style.setProperty(
          "--parallax-y",
          `${moveY}px`
        );
      };

      window.addEventListener("mousemove", handleMouseMove);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return <div className={"w-screen h-screen"}>{children}</div>;
};

export default ParallaxEffect;
