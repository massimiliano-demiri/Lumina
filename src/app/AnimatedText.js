"use client";

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

// Funzione per ottenere una citazione casuale da RapidAPI e filtrare quelle brevi
const fetchRandomQuote = async () => {
  try {
    const response = await fetch(
      "https://quotes15.p.rapidapi.com/quotes/random/?language_code=it",
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key":
            "54d5305512msh0070e00ae0986ddp11833ejsn723e184c92bf",
          "X-RapidAPI-Host": "quotes15.p.rapidapi.com",
        },
      }
    );
    const data = await response.json();

    // Filtro per citazioni brevi (ad esempio, sotto i 100 caratteri)
    if (data.content && data.content.length <= 100) {
      return data.content;
    } else {
      // Se la citazione è troppo lunga, tenta un'altra richiesta
      return fetchRandomQuote();
    }
  } catch (error) {
    console.error("Errore durante il fetch della citazione:", error);
    return ""; // Nessuna citazione in caso di errore
  }
};

const TypingEffect = () => {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [fullText, setFullText] = useState("");
  const [isNewQuoteReady, setIsNewQuoteReady] = useState(false); // Controllo per la nuova citazione
  const [isQuoteLoading, setIsQuoteLoading] = useState(false); // Flag per controllare se la nuova citazione è in caricamento

  useEffect(() => {
    const handleTyping = () => {
      if (isDeleting) {
        setCurrentPhrase((prev) => prev.substring(0, prev.length - 1));
        setTypingSpeed(50);
      } else if (!isQuoteLoading) {
        // Non scrivere nulla se la citazione è in caricamento
        setCurrentPhrase((prev) => fullText.substring(0, prev.length + 1));
      }

      if (!isDeleting && currentPhrase === fullText) {
        setTimeout(() => setIsDeleting(true), 1000); // Pausa prima di iniziare a cancellare
      } else if (isDeleting && currentPhrase === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setIsNewQuoteReady(true); // Imposta il flag quando la vecchia citazione è cancellata
      }
    };

    const typingTimeout = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(typingTimeout);
  }, [
    currentPhrase,
    isDeleting,
    loopNum,
    typingSpeed,
    fullText,
    isQuoteLoading,
  ]);

  useEffect(() => {
    const fetchQuote = async () => {
      setIsQuoteLoading(true); // Imposta il flag durante il caricamento della nuova citazione
      const quote = await fetchRandomQuote();
      setFullText(quote);
      setIsQuoteLoading(false); // Rimuove il flag dopo aver caricato la nuova citazione
    };

    // Carica una nuova citazione solo quando la vecchia è stata cancellata e non è già in corso un caricamento
    if (
      !isDeleting &&
      currentPhrase === "" &&
      isNewQuoteReady &&
      !isQuoteLoading
    ) {
      fetchQuote();
      setIsNewQuoteReady(false); // Resetta il flag dopo aver caricato la nuova citazione
    }
  }, [loopNum, isDeleting, currentPhrase, isNewQuoteReady, isQuoteLoading]);

  return (
    <Typography
      variant="h5"
      component="p"
      sx={{
        color: "#f0f0f0",
        fontFamily: "'Roboto', sans-serif",
        fontSize: "24px",
        maxWidth: "600px",
        textAlign: "center",
        minHeight: "60px",
        height: "20%",
      }}
    >
      {currentPhrase}
      <span style={{ borderRight: "2px solid #fff", paddingLeft: "2px" }} />
    </Typography>
  );
};

export default TypingEffect;
