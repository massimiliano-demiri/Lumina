"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "react-lottie";
import AIcon from "@mui/icons-material/TextIncrease";
import ArrowDownwardIcon from "@mui/icons-material/TextDecrease";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import CoffeeIcon from "@mui/icons-material/LocalCafe";
import loadingAnimation from "./alien.json";
import "./transitionStyles.css";
import { useMediaQuery } from "@mui/material";
import poetryData from "./poetry.json";
import romanceData from "./romance.json";
import scienceFictionData from "./science_fiction.json";
import historicalData from "./historical.json";
import mysteryData from "./mystery.json";
import fantasyData from "./fantasy.json";
import horrorData from "./horror.json";
import adventureData from "./adventure.json";

// Funzione per normalizzare e ripulire l'estratto
const normalizeExcerpt = (excerpt) => {
  return excerpt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Rimuove accenti
    .replace(/[^\w\s.,!?'"()]/g, "") // Rimuove caratteri speciali
    .replace(/\s+/g, " ") // Rimuove spazi multipli
    .trim(); // Rimuove spazi all'inizio e alla fine
};

const MINIMUM_CHARACTERS = 100;
const REFERENCE_TEXT = 200; // Lunghezza minima per la validità

const allGenres = [
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Historical",
  "Adventure",
  "Poetry",
  "Adventure",
];

const fetchExcerptFromEndpoint = async (book) => {
  if (!book || !book.endpoint) {
    console.error("Book or endpoint is undefined");
    return { title: book.titolo, excerpt: "" };
  }

  const apiKey = "57e9398e9ab6a85b25af676d55e25278"; // ScraperAPI key
  const proxyUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
    book.endpoint
  )}`;

  try {
    const response = await fetch(proxyUrl);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const titleElement = Array.from(
      doc.querySelectorAll("font[size='+1'] b")
    ).find((b) => b.innerText.trim() === book.titolo);

    if (!titleElement) {
      console.error("Titolo non trovato nella pagina:", book.titolo);
      return { title: book.titolo, excerpt: "" };
    }

    let excerpt = "";
    let currentElement = titleElement.parentElement;

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

    let normalizedExcerpt = normalizeExcerpt(excerpt.trim());

    if (normalizedExcerpt.length < MINIMUM_CHARACTERS) {
      normalizedExcerpt = "";
    }

    return {
      title: book.titolo,
      excerpt: normalizedExcerpt || "Estratto non disponibile",
    };
  } catch (error) {
    console.error("Errore nel fetch dell'estratto:", error);
    return { title: book.titolo, excerpt: "" };
  }
};

const getRandomGenre = (selectedGenres) => {
  if (selectedGenres.includes("Random")) {
    return allGenres[Math.floor(Math.random() * allGenres.length)];
  }
  if (selectedGenres.length === 1) return selectedGenres[0];
  return selectedGenres[Math.floor(Math.random() * selectedGenres.length)];
};

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
    case "Fantasy":
      return fantasyData.Fantasy;
    case "Horror":
      return horrorData.Horror;
    case "Adventure":
      return adventureData.Adventure;
    default:
      console.error("Genere non trovato:", genre);
      return [];
  }
};

const findAuthorByTitle = (genreData, bookTitle) => {
  const book = genreData.find((book) => book.titolo === bookTitle);
  return book ? book.autore : "Autore sconosciuto";
};

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
  const [nextBookData, setNextBookData] = useState(null); // Per il pre-caricamento
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(26);
  const [darkMode, setDarkMode] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [isRotating, setIsRotating] = useState(false);
  const [excerptCount, setExcerptCount] = useState(0);

  useEffect(() => {
    const genresQuery = searchParams.get("genres");
    if (genresQuery) setSelectedGenres(genresQuery.split(","));
  }, [searchParams]);

  useEffect(() => {
    if (selectedGenres.length > 0) generateRandomExcerpt();
  }, [selectedGenres]);

  const generateRandomExcerpt = async () => {
    setLoading(true);

    if (nextBookData) {
      setBookData(nextBookData); // Imposta il libro pre-caricato come attuale
      setNextBookData(null); // Resetta il prossimo estratto
      preLoadNextExcerpt(); // Pre-carica il prossimo
      setLoading(false);
      return;
    }

    const randomGenre = getRandomGenre(selectedGenres);
    const genreData = getGenreData(randomGenre);

    if (genreData.length === 0) {
      setLoading(false);
      return;
    }

    let validExcerptFound = false;

    while (!validExcerptFound) {
      const randomBook = getRandomBookFromGenre(genreData);

      if (!randomBook) {
        setLoading(false);
        return;
      }

      const { title, excerpt } = await fetchExcerptFromEndpoint(randomBook);

      if (excerpt && excerpt !== "Estratto non disponibile") {
        const author = findAuthorByTitle(genreData, randomBook.titolo);
        validExcerptFound = true;
        setBookData({
          title,
          author,
          excerpt,
          cover_src: randomBook.cover_src,
        });
        setExcerptCount((prevCount) => prevCount + 1);
        preLoadNextExcerpt(); // Pre-carica il prossimo estratto
      }
    }

    setLoading(false);
  };

  const preLoadNextExcerpt = async () => {
    const randomGenre = getRandomGenre(selectedGenres);
    const genreData = getGenreData(randomGenre);

    let validExcerptFound = false;
    while (!validExcerptFound) {
      const randomBook = getRandomBookFromGenre(genreData);

      if (!randomBook) {
        return;
      }

      const { title, excerpt } = await fetchExcerptFromEndpoint(randomBook);

      if (excerpt && excerpt !== "Estratto non disponibile") {
        const author = findAuthorByTitle(genreData, randomBook.titolo);
        validExcerptFound = true;
        setNextBookData({
          title,
          author,
          excerpt,
          cover_src: randomBook.cover_src,
        });
      }
    }
  };

  const handleBookDetails = () => {
    const genresToPass = selectedGenres.includes("Random")
      ? allGenres
      : selectedGenres;

    const queryParams = new URLSearchParams({
      title: bookData.title,
      author: bookData.author,
      cover_src: bookData.cover_src,
      genres: genresToPass.join(","),
    }).toString();

    router.push(`/book-details?${queryParams}`);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 500);
  };

  const adjustFontSize = (increase) =>
    setFontSize((prevSize) => (increase ? prevSize + 2 : prevSize - 2));

  const shouldShowDonation =
    excerptCount >= 5 && bookData.excerpt.length < REFERENCE_TEXT;

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
          <ArrowDownwardIcon
            fontSize="large"
            style={{ color: darkMode ? "#fff" : "#000" }}
          />
        </button>
        <button onClick={toggleTheme}>
          <WbIncandescentIcon
            fontSize="large"
            className={`rotate ${darkMode ? "dark" : ""}`}
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

            {shouldShowDonation && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  border: darkMode ? "1px solid #FFCC00" : "1px solid #FF9900",
                  backgroundColor: darkMode ? "#222" : "#fafafa",
                  color: darkMode ? "#FFCC00" : "#FF9900",
                  textAlign: "center",
                  borderRadius: "8px",
                }}
              >
                <p>
                  Questo sito è offerto gratuitamente! Se vuoi supportare lo
                  sviluppo, considera una piccola donazione!
                </p>
                <a
                  href="https://buymeacoffee.com/massimiliaf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textDecoration: "none",
                    color: darkMode ? "#FFCC00" : "#FF9900",
                    fontWeight: "bold",
                  }}
                >
                  <CoffeeIcon
                    style={{
                      marginRight: "0.5rem",
                      fontSize: "30px",
                      color: darkMode ? "#FFCC00" : "#FF9900",
                    }}
                  />
                  Supportami con un caffè!
                </a>
              </div>
            )}
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
              style={{
                backgroundColor: "#FF1744",
                borderRadius: "50%",
                padding: "15px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <ClearIcon style={{ color: "#fff", fontSize: "30px" }} />
            </button>

            <button
              onClick={handleBookDetails}
              style={{
                backgroundColor: "#FF9900",
                borderRadius: "50%",
                padding: "15px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <FavoriteIcon style={{ color: "#fff", fontSize: "30px" }} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExcerptComponent;
