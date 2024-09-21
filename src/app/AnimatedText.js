"use client"; // Indica che questo è un Client Component

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

// Frasi letterarie brevi
const phrases = [
  "Tutti i grandi sono stati bambini una volta.",
  "Chiamatemi Ismaele.",
  "L'essenziale è invisibile agli occhi.",
  "Era un mattino freddo e luminoso.",
  "Fissare il mare è difficile per chi l'ha visto.",
  "Ci sono corde nel cuore che non si spezzano.",
  "Tu sei come una pianta mai vista prima.",
  "È il tempo che hai perduto per la tua rosa.",
  "Il mio cuore affonda in una tempesta d’amore.",
  "Così scorre il mondo lontano.",
  "Era un mondo nuovo, pieno di luce.",
  "Attraversò una porta tra due mondi.",
  "Un giorno tutto sarà più chiaro.",
  "L’orizzonte prometteva nuove avventure.",
];

const TypingEffect = () => {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      if (isDeleting) {
        setCurrentPhrase((prev) => prev.substring(0, prev.length - 1));
        setTypingSpeed(50);
      } else {
        setCurrentPhrase((prev) => fullText.substring(0, prev.length + 1));
      }

      if (!isDeleting && currentPhrase === fullText) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && currentPhrase === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [currentPhrase, isDeleting, loopNum, typingSpeed]);

  return (
    <Typography
      variant="h5"
      component="p"
      sx={{
        color: "#f0f0f0", // Colore bianco chiaro per contrasto
        marginBottom: "2rem",
        fontFamily: "'Roboto', sans-serif",
        fontSize: "24px",
        maxWidth: "600px",
        textAlign: "center",
        minHeight: "60px", // Mantiene il layout stabile
      }}
    >
      {currentPhrase}
      <span
        style={{ borderRight: "2px solid #fff", paddingLeft: "2px" }}
      />{" "}
      {/* Cursore animato */}
    </Typography>
  );
};

export default TypingEffect;
