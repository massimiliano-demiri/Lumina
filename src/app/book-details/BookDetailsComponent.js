"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Lottie from "react-lottie";
import AmazonIcon from "@mui/icons-material/ShoppingCart"; // Icona Amazon
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Icona Freccia per il pulsante
import bookLoadingAnimation from "./alien.json"; // Animazione per il caricamento

const BookDetailsComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Otteniamo i valori dalla query string
  const title = searchParams.get("title");
  const author = searchParams.get("author");
  const initialDescription = searchParams.get("description"); // Descrizione passata tramite query
  const coverImage = searchParams.get("cover_src");

  const [isLoaded, setIsLoaded] = useState(false);
  const [isbn, setIsbn] = useState(""); // Stato per memorizzare l'ISBN
  const [affiliateLink, setAffiliateLink] = useState("");
  const [description, setDescription] = useState(initialDescription || ""); // Stato per la descrizione

  // Simulazione di un tempo di caricamento per la copertina
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Funzione per cercare la trama (descrizione) tramite Google Books API
  const fetchDescriptionFromGoogleBooks = async (title, author, lang) => {
    try {
      // Pulisci il titolo e autore da caratteri speciali
      const cleanTitle = title.replace(/[^\w\s]/gi, "").trim();
      const cleanAuthor = author.replace(/[^\w\s]/gi, "").trim();

      // Usa intitle e inauthor per migliorare la precisione
      const query = `intitle:${cleanTitle} inauthor:${cleanAuthor}&langRestrict=${lang}`;
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const bookInfo = data.items[0].volumeInfo;

        // Recupera l'ISBN
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
          // Fallback: usa un link di ricerca generico su Amazon
          const genericAmazonLink = `https://www.amazon.it/s?k=${encodeURIComponent(
            title + " " + author
          )}`;
          setAffiliateLink(genericAmazonLink);
        }

        // Recupera la descrizione del libro
        if (bookInfo.description) {
          const fetchedDescription = bookInfo.description;

          // Verifica se la descrizione sembra essere una trama o un testo di valore
          if (fetchedDescription.length > 50) {
            setDescription(fetchedDescription);
          } else {
            setDescription("Trama non disponibile.");
          }
        }
      }
    } catch (error) {
      console.error(
        "Errore nel recuperare i dettagli del libro da Google Books API:",
        error
      );
    }
  };

  // Funzione per cercare la descrizione tramite Open Library API come fallback
  const fetchDescriptionFromOpenLibrary = async (title, author) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(
          title
        )}&author=${encodeURIComponent(author)}`
      );
      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        const doc = data.docs[0];
        if (doc.first_publish_year) {
          setDescription(`Publicato nel ${doc.first_publish_year}`);
        }
      }
    } catch (error) {
      console.error("Errore nel recuperare i dettagli da Open Library:", error);
    }
  };

  // Logica a cascata: cerca in italiano, poi in inglese e infine traduci se necessario
  useEffect(() => {
    if (title && author) {
      // Prima ricerca in italiano
      fetchDescriptionFromGoogleBooks(title, author, "it").then(() => {
        if (!description || description === "Trama non disponibile.") {
          // Se la descrizione non è trovata o è breve, cerca in inglese
          fetchDescriptionFromGoogleBooks(title, author, "en").then(() => {
            if (!description || description === "Trama non disponibile.") {
              // Se fallisce, cerca su Open Library
              fetchDescriptionFromOpenLibrary(title, author);
            }
          });
        }
      });
    }
  }, [title, author]);

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
      {/* Sfondo dinamico minimalista con sfere */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: "linear-gradient(135deg, #1d1d1d, #333)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "500px",
            height: "500px",
            backgroundColor: "#FF5722",
            borderRadius: "50%",
            position: "absolute",
            top: "10%",
            left: "-20%",
            transform: "rotate(45deg)",
            animation: "spin 15s linear infinite",
            boxShadow: "0px 0px 50px rgba(255, 87, 34, 0.4)",
          }}
        />
        <div
          style={{
            width: "400px",
            height: "400px",
            backgroundColor: "#FF9800",
            borderRadius: "50%",
            position: "absolute",
            bottom: "15%",
            right: "-15%",
            animation: "spin-reverse 10s linear infinite",
            boxShadow: "0px 0px 50px rgba(255, 152, 0, 0.3)",
          }}
        />
      </div>

      {isLoaded ? (
        <>
          {/* Copertina del libro ingrandita */}
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
              <div
                style={{
                  width: "80%",
                  height: "5px",
                  backgroundColor: "#FF9800",
                  margin: "1rem 0",
                }}
              ></div>
              <p style={{ fontSize: "1rem" }}>
                Esplora questa fantastica storia e lasciati coinvolgere!
              </p>
            </div>
          )}

          {/* Titolo e autore sotto la copertina */}
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

          {/* Descrizione del libro */}
          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              maxWidth: "600px",
            }}
          >
            <p style={{ fontStyle: "italic", fontSize: "1.2rem" }}>
              {description || "Trama non disponibile."}
            </p>
          </div>

          {/* Pulsante di acquisto su Amazon */}
          {affiliateLink && (
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
                transition: "background-color 0.3s ease",
              }}
              onClick={() => window.open(affiliateLink, "_blank")}
            >
              <AmazonIcon style={{ marginRight: "10px" }} />
              Acquista su Amazon
            </button>
          )}

          {/* Pulsante minimal per tornare indietro */}
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
        // Animazione di caricamento
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
