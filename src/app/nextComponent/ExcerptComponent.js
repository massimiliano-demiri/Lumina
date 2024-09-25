"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "react-lottie";
import AIcon from "@mui/icons-material/TextIncrease";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import loadingAnimation from "./alien.json";
import "./transitionStyles.css";
import { useMediaQuery } from "@mui/material";
import poetryData from "./poetry.json";
import romanceData from "./romance.json";
import scienceFictionData from "./science_fiction.json";
import historicalData from "./historical.json";
import mysteryData from "./mystery.json";

// Funzione per estrarre titolo, autore e estratto specifico
const fetchExcerptFromEndpoint = async (book) => {
  if (!book || !book.titolo || !book.endpoint) {
    console.error("Book, title or endpoint is undefined");
    return { title: "Errore", excerpt: "Dati del libro non disponibili" };
  }

  const apiKey = "57e9398e9ab6a85b25af676d55e25278"; // Sostituisci con la tua chiave ScraperAPI
  const proxyUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
    book.endpoint
  )}`;

  try {
    const response = await fetch(proxyUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    console.log("HTML caricato:", doc.body.innerHTML); // Log dell'HTML caricato

    // Trova il titolo del libro
    const titleElement = Array.from(
      doc.querySelectorAll("font[size='+1'] b")
    ).find((b) => b.innerText.trim() === book.titolo);

    if (!titleElement) {
      console.error("Titolo non trovato nella pagina:", book.titolo);
      return { title: "Titolo non trovato", excerpt: "Estratto non trovato" };
    }

    console.log("Titolo trovato:", titleElement.innerText); // Log del titolo trovato

    // Risali nel DOM per trovare l'autore associato
    let currentElement = titleElement;
    let authorElement = null;

    // Itera sopra il titolo per trovare l'autore più vicino
    while (currentElement) {
      currentElement = currentElement.previousElementSibling;

      if (
        currentElement &&
        currentElement.nodeName === "FONT" &&
        currentElement.getAttribute("size") === "+2"
      ) {
        authorElement = currentElement.querySelector("b");
        break;
      }
    }

    const author = authorElement
      ? authorElement.innerText.trim()
      : "Autore sconosciuto";

    console.log("Autore trovato:", author); // Log dell'autore trovato

    // Estrazione dell'estratto dai tag <br> subito sotto il titolo
    let excerpt = "";
    currentElement = titleElement.parentElement;

    while (currentElement && currentElement.nextSibling) {
      currentElement = currentElement.nextSibling;

      if (currentElement.nodeName === "BR") continue;

      if (currentElement.nodeType === Node.TEXT_NODE) {
        excerpt += currentElement.textContent.trim() + " ";
      }

      if (
        currentElement.nodeName !== "BR" &&
        currentElement.nodeType !== Node.TEXT_NODE
      ) {
        break;
      }
    }

    console.log("Estratto trovato:", excerpt.trim()); // Log dell'estratto trovato

    return {
      title: book.titolo,
      author: author, // Autore estratto correttamente
      excerpt: excerpt.trim() || "Estratto non trovato",
    };
  } catch (error) {
    console.error("Errore nel fetch dell'estratto:", error);
    return { title: "Errore", excerpt: "Errore nel recupero dell'estratto" };
  }
};

// Funzione per scegliere un genere casuale
const getRandomGenre = (selectedGenres) => {
  if (selectedGenres.length === 1) return selectedGenres[0];
  return selectedGenres[Math.floor(Math.random() * selectedGenres.length)];
};

// Funzione per ottenere i dati JSON relativi a un genere
const getGenreData = (genre) => {
  switch (genre) {
    case "Poetry":
      return poetryData.Poetry;
    case "Romance":
      return romanceData.Romance;
    case "Science Fiction":
      return scienceFictionData["Science Fiction"];
    case "Historical":
      return historicalData.Historical;
    case "Mystery":
      return mysteryData.Mystery;
    default:
      console.error("Genere non trovato:", genre);
      return [];
  }
};

// Funzione per selezionare un libro casuale
const getRandomBookFromGenre = (genreData) => {
  if (!genreData || genreData.length === 0) {
    console.error("Nessun libro trovato per il genere selezionato");
    return null;
  }
  return genreData[Math.floor(Math.random() * genreData.length)];
};

const ExcerptComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    const genresQuery = searchParams.get("genres");
    if (genresQuery) setSelectedGenres(genresQuery.split(","));
  }, [searchParams]);

  useEffect(() => {
    if (selectedGenres.length > 0) generateRandomExcerpt();
  }, [selectedGenres]);

  const generateRandomExcerpt = async () => {
    setLoading(true);

    const randomGenre = getRandomGenre(selectedGenres);
    const genreData = getGenreData(randomGenre);

    if (genreData.length === 0) {
      setLoading(false);
      return;
    }

    const randomBook = getRandomBookFromGenre(genreData);

    if (!randomBook) {
      setLoading(false);
      return;
    }

    const { title, author, excerpt } = await fetchExcerptFromEndpoint(
      randomBook
    );
    setBookData({ title, author, excerpt, cover_src: randomBook.cover_src });

    setLoading(false);
  };

  const handleBookDetails = () => {
    const queryParams = new URLSearchParams({
      title: bookData.title,
      author: bookData.author,
      cover_src: bookData.cover_src,
      genres: selectedGenres.join(","), // Passiamo i generi come array
    }).toString();
    router.push(`/book-details?${queryParams}`);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const adjustFontSize = (increase) =>
    setFontSize((prevSize) => (increase ? prevSize + 2 : prevSize - 2));

  return (
    <div
      style={{
        padding: "0.5rem",
        backgroundColor: darkMode ? "#121212" : "#f0f0f0",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        fontFamily: "'Noto Serif', serif",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "0.5rem",
        }}
      >
        <button onClick={() => adjustFontSize(true)}>
          <AIcon
            fontSize="large"
            style={{ color: darkMode ? "#fff" : "#000" }}
          />
        </button>
        <button onClick={() => adjustFontSize(false)}>
          <AIcon
            fontSize="large"
            style={{ color: darkMode ? "#fff" : "#000" }}
          />
        </button>
        <button onClick={toggleTheme}>
          <WbIncandescentIcon
            fontSize="large"
            style={{ color: darkMode ? "#fff" : "#000" }}
          />
        </button>
      </div>

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", height: "60vh" }}
        >
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: loadingAnimation,
            }}
            height={200}
            width={200}
          />
        </div>
      ) : (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.5rem",
              maxHeight: "calc(100vh - 140px)",
            }}
          >
            <p style={{ fontSize: `${fontSize}px`, textAlign: "justify" }}>
              {bookData.excerpt}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <button
              onClick={generateRandomExcerpt}
              style={{ backgroundColor: "#FF9800", padding: "10px" }}
            >
              🤮
            </button>
            <button
              onClick={handleBookDetails}
              style={{ backgroundColor: "#FF1744", padding: "10px" }}
            >
              ❤️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExcerptComponent;
