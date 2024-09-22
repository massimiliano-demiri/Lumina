"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion"; // Per animazioni fluide

// Funzione che genera una linea dinamica
const Line = ({ x1, y1, x2, y2 }) => {
  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="white"
      strokeWidth="0.5"
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1, pathLength: 1 }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
};

const LoadingAnimation = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#121212",
        position: "relative",
      }}
    >
      {/* Sfondo dinamico con linee bianche */}
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
      >
        {/* Linee casuali che si muovono */}
        <Line x1="10" y1="30" x2="90" y2="20" />
        <Line x1="20" y1="60" x2="80" y2="40" />
        <Line x1="5" y1="80" x2="95" y2="70" />
        <Line x1="50" y1="10" x2="50" y2="90" />
      </svg>

      {/* Testo animato */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, yoyo: Infinity }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#fff", fontWeight: "bold", letterSpacing: "0.1em" }}
        >
          Prepariamo il tuo viaggio...
        </Typography>
      </motion.div>
    </Box>
  );
};

export default LoadingAnimation;
