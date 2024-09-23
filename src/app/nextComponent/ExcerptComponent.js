"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "react-lottie";
import AIcon from "@mui/icons-material/TextIncrease";
import WbIncandescentIcon from "@mui/icons-material/WbIncandescent";
import loadingAnimation from "./alien.json"; // Animation for loading new excerpts
import transitionAnimation from "./max.json"; // Animation for transitioning to book details
import bookDataJson from "./bookData";
import "./transitionStyles.css";
import { useMediaQuery } from "@mui/material";

const fetchBookAndDetails = async (bookId) => {
  const proxyUrl =
    "https://api.scraperapi.com?api_key=57e9398e9ab6a85b25af676d55e25278&url=";
  const url = `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}.txt`;

  try {
    const response = await fetch(proxyUrl + url);
    if (response.ok) {
      const text = await response.text();
      const lines = text.split("\n");
      const title =
        lines
          .find((line) => line.startsWith("Title: "))
          ?.replace("Title: ", "") || "Titolo Sconosciuto";
      const author =
        lines
          .find((line) => line.startsWith("Author: "))
          ?.replace("Author: ", "") || "Autore Sconosciuto";
      return { text, title, author };
    } else {
      throw new Error(`Errore nel download del libro con ID: ${bookId}`);
    }
  } catch (error) {
    console.error(error);
    return {
      text: null,
      title: "Titolo Sconosciuto",
      author: "Autore Sconosciuto",
    };
  }
};

const getSignificantParagraph = (text) => {
  const startIdx = Math.floor(text.length / 8);
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
    } else if (charCount > 0 && charCount + sentence.length <= 1900) {
      selectedParagraph += sentence + " ";
      charCount += sentence.length;
    } else {
      break;
    }
  }

  return selectedParagraph.trim() || null;
};

const fetchCoverAndAmazonLink = (bookId) => {
  for (const genre in bookDataJson) {
    const book = bookDataJson[genre].find((book) => book.id === bookId);
    if (book) {
      return {
        cover_src: book.cover_src,
        amazon_link: book.amazon_link,
      };
    }
  }
  return null;
};

const ExcerptComponent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsQuery = searchParams.get("ids");
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading excerpts
  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(true);
  const [blurActive, setBlurActive] = useState(true);
  const [bookId, setBookId] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false); // Transitioning to book details

  const isMobile = useMediaQuery("(max-width:600px)");

  const bookIds = idsQuery ? idsQuery.split(",") : [];

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: isTransitioning ? transitionAnimation : loadingAnimation, // Switch between animations
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const revealBookDetails = () => {
    if (bookData && bookId) {
      setIsTransitioning(true); // Trigger the transition animation

      setTimeout(() => {
        const { cover_src, amazon_link } =
          fetchCoverAndAmazonLink(bookId) || {};
        const queryParams = new URLSearchParams({
          title: bookData.title,
          author: bookData.author,
          paragraph: bookData.paragraph,
          bookId: bookId,
          cover_src: cover_src || "",
          amazon_link: amazon_link || "",
          ids: bookIds.join(","),
        }).toString();

        router.push(`/book-details?${queryParams}`);
      }, 2000); // Delay the transition to allow animation
    }
  };

  const getRandomBookData = () => {
    if (bookIds.length > 0) {
      const randomIndex = Math.floor(Math.random() * bookIds.length);
      return bookIds[randomIndex];
    }
    return null;
  };

  const extractBook = async (id = null) => {
    setLoading(true); // Show loading animation
    setBlurActive(true);
    setBookData(null);
    setIsTransitioning(false); // Reset transition state

    let found = false;
    let selectedBookId = id || getRandomBookData();

    while (!found && selectedBookId) {
      const { text, title, author } = await fetchBookAndDetails(selectedBookId);
      if (text) {
        const significantParagraph = getSignificantParagraph(text);
        if (significantParagraph) {
          setBookData({
            id: selectedBookId,
            paragraph: significantParagraph,
            title,
            author,
          });
          setBookId(selectedBookId);
          found = true;
        }
      }
      if (!id) selectedBookId = getRandomBookData();
    }

    setLoading(false); // Stop loading animation
  };

  useEffect(() => {
    const idFromParams = searchParams.get("id");
    extractBook(idFromParams);
  }, [idsQuery]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const adjustFontSize = (increase) => {
    setFontSize((prevSize) => increase ? (prevSize<26 ? prevSize + 2 : prevSize) : (prevSize>12 ? prevSize - 2 : prevSize))
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
        padding: "1rem",
        backgroundColor: darkMode ? "#121212" : "#f0f0f0",
        color: darkMode ? "#fff" : "#000",
        minHeight: "100vh",
        transition: "background-color 0.5s, color 0.5s",
        fontFamily: "'Noto Serif', serif",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100vw",
      }}
      className={'overflow-hidden'}
    >
      {/* Icon section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "15px",
          marginBottom: "0.5rem",
        }}
      >{
        bookData &&
          <>
            <button
                onClick={() => adjustFontSize(true)}
                style={{
                  cursor: "pointer",
                  backgroundColor: "transparent",
                  border: "none",
                }}
            >
              <AIcon
                  fontSize="large"
                  style={{color: darkMode ? "#fff" : "#000"}}
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
              <AIcon
                  fontSize="large"
                  style={{color: darkMode ? "#fff" : "#000"}}
              />
            </button>
          </>
      }
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

      {loading || isTransitioning ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "60vh",
          }}
        >
          <Lottie options={lottieOptions} height={200} width={200} />
        </div>
      ) : bookData ? (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.5rem",
              marginBottom: "60px",
              maxHeight: "calc(100vh - 140px)",
              scrollbarWidth: 'none',
            }}
            className={'overflow-auto'}
          >
            {renderBlurredText(bookData.paragraph)}
          </div>

          {/* Improved buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              position: "fixed",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1,
            }}
          >
            <button
              onClick={() => extractBook()}
              style={{
                padding: isMobile ? "0.7rem" : "1rem",
                backgroundColor: "#FF9800",
                color: "#fff",
                borderRadius: "12px",
                cursor: "pointer",
                border: "none",
                fontSize: isMobile ? "20px" : "24px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease",
                width: isMobile ? "50px" : "60px",
                height: isMobile ? "50px" : "60px",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              🤮
            </button>

            <button
              onClick={revealBookDetails}
              style={{
                padding: isMobile ? "0.7rem" : "1rem",
                backgroundColor: "#FF1744",
                color: "#fff",
                borderRadius: "12px",
                cursor: "pointer",
                border: "none",
                fontSize: isMobile ? "20px" : "24px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease",
                width: isMobile ? "50px" : "60px",
                height: isMobile ? "50px" : "60px",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              ❤️
            </button>
          </div>
        </>
      ) : (
        <p>Nessun estratto disponibile.</p>
      )}
    </div>
  );
};

export default ExcerptComponent;
