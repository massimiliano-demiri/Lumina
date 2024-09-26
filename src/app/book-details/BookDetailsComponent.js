"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "react-lottie";
import AmazonIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import bookLoadingAnimation from "./alien.json";

const BookDetailsComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Otteniamo i valori dalla query string
  const title = searchParams.get("title");
  const author = searchParams.get("author");
  const coverImage = searchParams.get("cover_src");
  const genres = searchParams.get("genres")?.split(",") || []; // Recupera i generi

  const [isLoaded, setIsLoaded] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [description, setDescription] = useState("");

  // Simulazione di un tempo di caricamento per la copertina
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Funzione per cercare la trama tramite Google Books API
  const fetchDescriptionFromGoogleBooks = async (title, author, lang) => {
    try {
      const cleanTitle = title.replace(/[^\w\s]/gi, "").trim();
      const cleanAuthor = author.replace(/[^\w\s]/gi, "").trim();
      const query = `intitle:${cleanTitle} inauthor:${cleanAuthor}&langRestrict=${lang}`;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const bookInfo = data.items[0].volumeInfo;
        const industryIdentifiers = bookInfo.industryIdentifiers || [];
        const isbnObject = industryIdentifiers.find(
          (identifier) =>
            identifier.type === "ISBN_13" || identifier.type === "ISBN_10"
        );
        if (isbnObject) {
          setIsbn(isbnObject.identifier);
          setAffiliateLink(
            `https://www.amazon.it/dp/${isbnObject.identifier}?tag=luminaid-21`
          );
        } else {
          const genericAmazonLink = `https://www.amazon.it/s?k=${encodeURIComponent(
            title + " " + author
          )}`;
          setAffiliateLink(genericAmazonLink);
        }

        if (bookInfo.description) {
          setDescription(bookInfo.description);
        } else {
          setDescription("Trama non disponibile.");
        }
      }
    } catch (error) {
      console.error("Errore nel recuperare i dettagli del libro:", error);
    }
  };

  useEffect(() => {
    if (title && author) {
      fetchDescriptionFromGoogleBooks(title, author, "it");
    }
  }, [title, author]);

  // Funzione per tornare indietro con i generi selezionati

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#121212",
        color: "#fff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isLoaded ? (
        <>
          {coverImage ? (
            <img
              src={coverImage}
              alt="Copertina del libro"
              style={{
                borderRadius: "15px",
                maxWidth: "300px",
                maxHeight: "400px",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.6)",
                transition: "transform 0.5s ease-in-out",
                transform: isLoaded ? "scale(1)" : "scale(0.8)",
              }}
            />
          ) : (
            <div
              style={{
                width: "300px",
                height: "400px",
                borderRadius: "15px",
                backgroundColor: "#333",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
                fontFamily: "'Noto Serif', serif",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.5)",
                padding: "10px",
                textAlign: "center",
              }}
            >
              <h2 style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>
                {title}
              </h2>
              <h3 style={{ fontSize: "1.2rem", fontStyle: "italic" }}>
                di {author || "Autore Sconosciuto"}
              </h3>
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold" }}>{title}</h2>
            <h3
              style={{
                fontSize: "1.5rem",
                fontStyle: "italic",
                color: "#FF9800",
              }}
            >
              di {author || "Autore Sconosciuto"}
            </h3>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              maxWidth: "600px",
              maxHeight: "20vh",
              overflow: "auto",
            }}
          >
            <p style={{ fontStyle: "italic", fontSize: "1.2rem" }}>
              {description || "Trama non disponibile."}
            </p>
          </div>

          {/* Mostra sempre il pulsante Acquista su Amazon */}
          <button
            style={{
              padding: "0.8rem 1.5rem",
              backgroundColor: "#FF9900",
              color: "#fff",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2rem",
              cursor: "pointer",
              border: "none",
              fontSize: "16px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
            }}
            onClick={() =>
              window.open(
                affiliateLink ||
                  `https://www.amazon.it/s?k=${encodeURIComponent(
                    title + " " + author
                  )}`,
                "_blank"
              )
            }
          >
            <AmazonIcon style={{ marginRight: "10px" }} />
            Acquista su Amazon
          </button>

          <div
            onClick={() => router.back()}
            style={{
              position: "absolute",
              bottom: "20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.8rem 1.5rem",
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
            Torna agli estratti
          </div>
        </>
      ) : (
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: bookLoadingAnimation,
            rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
          }}
          height={200}
          width={200}
        />
      )}
    </div>
  );
};

export default BookDetailsComponent;
