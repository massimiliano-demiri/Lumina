"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "react-lottie";
import { CSSTransition } from "react-transition-group";
import AIcon from "@mui/icons-material/TextIncrease";
import ArrowDownwardIcon from "@mui/icons-material/TextDecrease";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import CoffeeIcon from "@mui/icons-material/LocalCafe";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import loadingAnimation from "./alien.json";
import "./transitionStyles.css";
import { useMediaQuery } from "@mui/material";

// Import Supabase client
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ujytoqeuszwkokdlfkyh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqeXRvcWV1c3p3a29rZGxma3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2MTU2NDQsImV4cCI6MjA0MzE5MTY0NH0.1zSCsFZOdLsiUC6dM_62wrjMhCuDqJYe0y0zmE1gay8";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
];

// Funzione per normalizzare e ripulire l'estratto
const normalizeExcerpt = (excerpt) => {
  const cleanedExcerpt = excerpt
    .replace(/[^\w\s.,!?'"()àèéìòù]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleanedExcerpt;
};

// Fetch excerpt from Supabase based on genre
const fetchExcerptFromSupabase = async (selectedGenre) => {
  const apiUrlCount = `https://ujytoqeuszwkokdlfkyh.supabase.co/rest/v1/books?select=*&genre=eq.${selectedGenre}&language=eq.it`;

  const apiKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqeXRvcWV1c3p3a29rZGxma3loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2MTU2NDQsImV4cCI6MjA0MzE5MTY0NH0.1zSCsFZOdLsiUC6dM_62wrjMhCuDqJYe0y0zmE1gay8";

  try {
    // 1. Effettua una prima richiesta per ottenere il numero totale di libri
    const countResponse = await fetch(apiUrlCount, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Prefer: "count=exact", // Richiede il conteggio esatto
      },
    });

    if (!countResponse.ok) {
      throw new Error("Errore nel conteggio dei libri.");
    }

    const totalBooks = countResponse.headers.get("content-range").split("/")[1]; // Ottiene il numero totale dei libri

    if (totalBooks === 0) {
      return { title: "", excerpt: "Nessun libro disponibile" };
    }

    // 2. Calcola un offset casuale
    const randomOffset = Math.floor(Math.random() * totalBooks);

    // 3. Effettua la richiesta per ottenere il libro con l'offset casuale
    const apiUrl = `https://ujytoqeuszwkokdlfkyh.supabase.co/rest/v1/books?select=*&genre=eq.${selectedGenre}&language=eq.it&limit=1&offset=${randomOffset}`;

    const response = await fetch(apiUrl, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Errore nel recupero del libro.");
    }

    const data = await response.json();
    if (data.length === 0) {
      return { title: "", excerpt: "Estratto non disponibile" };
    }

    const book = data[0];
    const normalizedExcerpt = book.excerpt.trim();
    if (normalizedExcerpt.length < MINIMUM_CHARACTERS) {
      return { title: book.title, excerpt: "Estratto non disponibile" };
    }

    return {
      title: book.title,
      excerpt: normalizedExcerpt,
      author: book.author,
      cover_src: book.cover_src,
      isbn: book.isbn,
      plot: book.plot,
    };
  } catch (error) {
    console.error("Errore nel fetch dell'estratto:", error);
    return { title: "", excerpt: "Estratto non disponibile" };
  }
};

const getRandomGenre = (selectedGenres) => {
  if (selectedGenres.includes("Random")) {
    return allGenres[Math.floor(Math.random() * allGenres.length)];
  }
  if (selectedGenres.length === 1) return selectedGenres[0];
  return selectedGenres[Math.floor(Math.random() * selectedGenres.length)];
};

const ExcerptComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [bookData, setBookData] = useState(null);
  const [nextBookData, setNextBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(26);
  const [darkMode, setDarkMode] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [isRotating, setIsRotating] = useState(false);
  const [excerptCount, setExcerptCount] = useState(0);
  const [inTransition, setInTransition] = useState(false);

  useEffect(() => {
    const genresQuery = searchParams.get("genres");
    if (genresQuery) setSelectedGenres(genresQuery.split(","));
  }, [searchParams]);

  useEffect(() => {
    if (selectedGenres.length > 0) generateRandomExcerpt();
  }, [selectedGenres]);

  const generateRandomExcerpt = async () => {
    setInTransition(true);

    if (nextBookData) {
      setTimeout(() => {
        setBookData(nextBookData);
        setNextBookData(null);
        setExcerptCount((prevCount) => prevCount + 1);
        preLoadNextExcerpt();
        setLoading(false);
        setInTransition(false);
      }, 500);
      return;
    }

    const randomGenre = getRandomGenre(selectedGenres);
    const { title, excerpt, author, cover_src, isbn } =
      await fetchExcerptFromSupabase(randomGenre);

    if (excerpt && excerpt !== "Estratto non disponibile") {
      setBookData({ title, author, excerpt, cover_src, isbn });
      setExcerptCount((prevCount) => prevCount + 1);
      preLoadNextExcerpt();
    }

    setLoading(false);
    setInTransition(false);
  };

  const preLoadNextExcerpt = async () => {
    const randomGenre = getRandomGenre(selectedGenres);
    const nextBook = await fetchExcerptFromSupabase(randomGenre);
    if (nextBook.excerpt && nextBook.excerpt !== "Estratto non disponibile") {
      setNextBookData(nextBook);
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
      isbn: bookData.isbn,
      genres: genresToPass.join(","),
      plot: bookData.plot,
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
