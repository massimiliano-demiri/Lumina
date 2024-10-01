"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "react-lottie";
import { CSSTransition } from "react-transition-group"; // Importiamo CSSTransition
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Funzione per normalizzare e ripulire l'estratto
const normalizeExcerpt = (excerpt) => {
  // Remove special characters and clean up whitespace
  const cleanedExcerpt = excerpt
    .replace(/[^\w\s.,!?'"()àèéìòù]/g, "") // Allow accented characters
    .replace(/\s+/g, " ") // Remove multiple spaces
    .trim(); // Trim spaces at the beginning and end

  return cleanedExcerpt;
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

  const apiKey = "316d3c6a041e9a2c35e97b3acdd31012"; // ScraperAPI key
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

  const [inTransition, setInTransition] = useState(false); // Aggiunto stato per la transizione

  useEffect(() => {
    const genresQuery = searchParams.get("genres");
    if (genresQuery) setSelectedGenres(genresQuery.split(","));
  }, [searchParams]);

  useEffect(() => {
    if (selectedGenres.length > 0) generateRandomExcerpt();
  }, [selectedGenres]);

  const generateRandomExcerpt = async () => {
    setInTransition(true); // Inizia la transizione

    if (nextBookData) {
      setTimeout(() => {
        setBookData(nextBookData); // Imposta il libro pre-caricato come attuale
        setNextBookData(null); // Resetta il prossimo estratto
        setExcerptCount((prevCount) => prevCount + 1); // Incrementa il contatore solo quando l'utente vede l'estratto
        preLoadNextExcerpt(); // Pre-carica il prossimo
        setLoading(false);
        setInTransition(false); // Termina la transizione
      }, 500); // Tempo per la transizione
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
          isbn: randomBook.isbn, // Include ISBN here
        });

        setExcerptCount((prevCount) => prevCount + 1); // Incrementa il contatore solo quando l'utente vede l'estratto
        preLoadNextExcerpt(); // Pre-carica il prossimo estratto
      }
    }

    setLoading(false);
    setInTransition(false); // Termina la transizione
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
      isbn: bookData.isbn, // Add the ISBN here
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
    setFontSize((prevSize) =>
      increase
        ? prevSize < 28
          ? prevSize + 2
          : prevSize
        : prevSize > 14
        ? prevSize - 2
        : prevSize
    );

  const shouldShowDonation =
    excerptCount >= 5 && bookData.excerpt.length < REFERENCE_TEXT;

  return (
    <div
      className={"w-full h-full p-4 flex flex-col justify-between items-center"}
      style={{
        backgroundColor: darkMode ? "#121212" : "#f0f0f0",
        color: darkMode ? "#fff" : "#000",
        fontFamily: "'Noto Serif', serif",
      }}
    >
      <div
        className={`flex ${
          !loading ? "justify-between" : "justify-center"
        } w-full gap-6 h-1/12 items-center`}
      >
        {!loading ? (
          <>
            <ArrowBackIcon onClick={() => router.push("/selectGenre")} />
            <div className={`flex justify-center gap-6 h-full items-center`}>
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
            <div></div>
          </>
        ) : (
          <button onClick={toggleTheme}>
            <WbIncandescentIcon
              fontSize="large"
              className={`rotate ${darkMode ? "dark" : ""}`}
              style={{ color: darkMode ? "#fff" : "#000" }}
            />
          </button>
        )}
      </div>

      {loading ? (
        <>
          <div className={"flex justify-center h-[60%] items-center"}>
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
          <div
            onClick={() => router.push("/selectGenre")}
            className={
              "cursor-pointer flex items-center justify-center px-5 py-3"
            }
            style={{
              borderRadius: "30px",
              backgroundColor: "#282828",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "500",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <ArrowBackIcon style={{ marginRight: "8px" }} />
            Torna ai generi
          </div>
        </>
      ) : (
        <>
          <CSSTransition
            in={!inTransition}
            timeout={500}
            classNames="fade"
            unmountOnExit
          >
            <div
              className={
                "flex flex-col items-center gap-2 overflow-y-auto p-2 h-[80%]"
              }
            >
              <p style={{ fontSize: `${fontSize}px`, textAlign: "justify" }}>
                {bookData.excerpt}
              </p>

              {shouldShowDonation && (
                <div
                  style={{
                    marginTop: "1rem",
                    padding: "0.5rem",
                    border: darkMode
                      ? "1px solid #FFCC00"
                      : "1px solid #FF9900",
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
          </CSSTransition>

          <div className={"h-10% flex justify-center gap-6"}>
            <button
              onClick={generateRandomExcerpt}
              style={{
                background: "linear-gradient(135deg, #7986cb, #5c6bc0)",
                borderRadius: "50%",
                padding: "15px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0px 8px 16px rgba(121, 134, 203, 0.7)",
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.3)";
                e.target.style.background =
                  "linear-gradient(135deg, #5c6bc0, #303f9f)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.background =
                  "linear-gradient(135deg, #7986cb, #5c6bc0)";
              }}
            >
              <ClearIcon
                style={{
                  color: "#fff",
                  fontSize: "26px",
                  transition: "transform 0.3s ease",
                  opacity: 0.9,
                }}
              />
            </button>

            <button
              onClick={handleBookDetails}
              style={{
                background: "linear-gradient(135deg, #5c6bc0, #7986cb)",
                borderRadius: "50%",
                padding: "15px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0px 8px 16px rgba(121, 134, 203, 0.7)",
                transition: "transform 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.3)";
                e.target.style.background =
                  "linear-gradient(135deg, #303f9f, #5c6bc0)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.background =
                  "linear-gradient(135deg, #5c6bc0, #7986cb)";
              }}
            >
              <FavoriteIcon
                style={{
                  color: "#fff",
                  fontSize: "26px",
                  transition: "transform 0.3s ease",
                  opacity: 0.9,
                }}
              />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExcerptComponent;
