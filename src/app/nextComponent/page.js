"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Lottie from "react-lottie";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AmazonIcon from "@mui/icons-material/ShoppingCart"; // Icona Amazon
import loadingAnimation from "./alien.json";
import bookDataByGenre from "./bookData.json";

const fetchBook = async (bookId) => {
  const proxyUrl = "https://thingproxy.freeboard.io/fetch/";
  const url = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`;

  try {
    const response = await fetch(proxyUrl + url);
    if (response.ok) {
      const text = await response.text();
      return text;
    } else {
      throw new Error(`Errore nel download del libro con ID: ${bookId}`);
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const fetchBookDetails = async (title) => {
  const googleBooksApi = "https://www.googleapis.com/books/v1/volumes";
  const queryUrl = `${googleBooksApi}?q=intitle:${encodeURIComponent(
    title
  )}&maxResults=1`;

  try {
    const response = await fetch(queryUrl);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const bookInfo = data.items[0].volumeInfo;
      const coverImage = bookInfo.imageLinks?.thumbnail || null;
      const description =
        bookInfo.description || "Nessuna descrizione disponibile.";
      return { coverImage, description };
    }
  } catch (error) {
    console.error("Errore nel recuperare i dettagli del libro", error);
  }
  return { coverImage: null, description: "Nessuna descrizione disponibile." };
};

const getSignificantParagraph = (text) => {
  const startIdx = Math.floor(text.length / 6);
  const limitedText = text.slice(startIdx);
  const sentences = limitedText.match(/[^.!?]+[.!?]+/g);

  if (!sentences || sentences.length === 0) return null;

  let selectedParagraph = "";
  let charCount = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();

    if (
      charCount === 0 &&
      sentence.charAt(0) !== sentence.charAt(0).toUpperCase()
    ) {
      continue;
    }

    if (charCount === 0 && sentence.length > 50) {
      selectedParagraph += sentence + " ";
      charCount += sentence.length;
    } else if (charCount > 0 && charCount + sentence.length <= 1500) {
      selectedParagraph += sentence + " ";
      charCount += sentence.length;
    }
  }

  return selectedParagraph.trim() || null;
};

const ExcerptComponent = () => {
  const searchParams = useSearchParams();
  const genresQuery = searchParams.get("genres");
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [bookDetails, setBookDetails] = useState(null); // Dettagli del libro
  const [blurActive, setBlurActive] = useState(true);

  const selectedGenres = genresQuery ? genresQuery.split(",") : [];

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const getRandomBookId = () => {
    const allBookIds = [];
    selectedGenres.forEach((genre) => {
      if (bookDataByGenre[genre]) {
        const genreBooks = bookDataByGenre[genre].map((book) => book.id);
        allBookIds.push(...genreBooks);
      }
    });
    if (allBookIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * allBookIds.length);
      return allBookIds[randomIndex];
    }
    return null;
  };

  const extractBook = async () => {
    setLoading(true);
    setShowTitle(false);
    setBlurActive(true);
    setBookData(null);

    let found = false;
    while (!found) {
      const bookId = getRandomBookId();
      if (!bookId) break;
      const bookText = await fetchBook(bookId);

      if (bookText) {
        let significantParagraph = getSignificantParagraph(bookText);
        if (significantParagraph) {
          setBookData({
            paragraph: significantParagraph,
            title: `Titolo del Libro ${bookId}`,
            author: "Autore Sconosciuto",
          });
          found = true;
        }
      }
    }

    setLoading(false);
  };

  const revealBookDetails = async () => {
    if (bookData) {
      setBlurActive(false); // Rimuovi blur
      const details = await fetchBookDetails(bookData.title);
      setBookDetails(details); // Salva i dettagli del libro
      setShowTitle(true);
    }
  };

  useEffect(() => {
    extractBook();
  }, [genresQuery]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const adjustFontSize = (increase) => {
    setFontSize((prevSize) => (increase ? prevSize + 2 : prevSize - 2));
  };

  const renderBlurredText = (text) => {
    const sentences = text.split(" ");
    const visibleSentences = sentences
      .slice(0, Math.floor(sentences.length * 0.8))
      .join(" ");
    const blurredSentences = sentences
      .slice(Math.floor(sentences.length * 0.8))
      .join(" ");

    return (
      <p style={{ fontSize: `${fontSize}px`, textAlign: "justify" }}>
        {visibleSentences}{" "}
        <span
          style={{
            filter: blurActive ? "blur(5px)" : "none",
            transition: "filter 0.5s ease-in-out",
            backgroundColor: blurActive ? "rgba(0, 0, 0, 0.2)" : "transparent",
            padding: "2px 4px",
            borderRadius: "4px",
          }}
        >
          {blurredSentences}
        </span>
      </p>
    );
  };

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: darkMode ? "#121212" : "#f0f0f0",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        transition: "background-color 0.5s, color 0.5s",
        fontFamily: "'Noto Serif', serif",
        position: "relative",
      }}
    >
      {/* Controlli centrati */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => adjustFontSize(true)}
          style={{
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          <ZoomInIcon
            fontSize="large"
            style={{ color: darkMode ? "#fff" : "#000" }}
          />
        </button>
        <button
          onClick={() => adjustFontSize(false)}
          style={{
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          <ZoomOutIcon
            fontSize="large"
            style={{ color: darkMode ? "#fff" : "#000" }}
          />
        </button>
        <button
          onClick={toggleTheme}
          style={{
            cursor: "pointer",
            backgroundColor: "transparent",
            border: "none",
            transition: "transform 0.5s ease",
            transform: darkMode ? "rotate(0deg)" : "rotate(180deg)",
          }}
        >
          <WbIncandescentIcon
            fontSize="large"
            style={{ color: darkMode ? "#fff" : "#000" }}
          />
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <Lottie options={lottieOptions} height={200} width={200} />
        </div>
      ) : bookData ? (
        <div style={{ opacity: 0, animation: "fadeIn 1s forwards" }}>
          {/* Estratto */}
          <div
            style={{
              maxHeight: "60vh",
              overflowY: "auto",
              padding: "1rem",
              position: "relative",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {renderBlurredText(bookData.paragraph)}

            {/* Pulsante per rivelare titolo e autore */}
            {!showTitle && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <button
                  onClick={revealBookDetails}
                  style={{
                    padding: "0.8rem",
                    backgroundColor: darkMode ? "#FF9800" : "#FF5722",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "none",
                    fontSize: "16px",
                  }}
                >
                  📖 Rivela Titolo e Autore
                </button>
              </div>
            )}
          </div>

          {/* Mostra copertina, descrizione e pulsante di acquisto */}
          {showTitle && (
            <div style={{ textAlign: "center", marginTop: "2rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                {/* Mostra la copertina o un simulacro */}
                {bookDetails?.coverImage ? (
                  <img
                    src={bookDetails.coverImage}
                    alt="Copertina del libro"
                    style={{
                      borderRadius: "10px",
                      maxWidth: "200px",
                      maxHeight: "300px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "200px",
                      height: "300px",
                      border: "1px solid #ddd",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: darkMode ? "#555" : "#ccc",
                      borderRadius: "10px",
                    }}
                  >
                    <p style={{ padding: "10px" }}>{bookData.title}</p>
                  </div>
                )}

                {/* Descrizione */}
                <p style={{ fontStyle: "italic" }}>
                  {bookDetails?.description}
                </p>

                {/* Pulsante Amazon */}
                <button
                  style={{
                    padding: "0.8rem",
                    backgroundColor: "#FF9900",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <AmazonIcon />
                  Acquista su Amazon
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Nessun estratto disponibile.</p>
      )}
    </div>
  );
};

export default ExcerptComponent;
