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
  const description = searchParams.get("description");
  const coverImage = searchParams.get("cover_src");

  const [isLoaded, setIsLoaded] = useState(false);

  // Simulazione di un tempo di caricamento per la copertina
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Funzione per tornare al componente precedente
  // Funzione per tornare al componente precedente
  const goBack = () => {
    const genres = searchParams.get("genres"); // Recupera i generi dalla query
    const ids = searchParams.get("ids"); // Recupera gli ID dalla query

    // Decodifica la stringa degli ID
    const decodedIds = decodeURIComponent(ids);

    setTimeout(() => {
      if (genres) {
        router.push(
          `/nextComponent?genres=${encodeURIComponent(
            genres
          )}&ids=${decodedIds}`
        );
      } else {
        router.push(`/nextComponent?ids=${decodedIds}`);
      }
    }, 300); // Ritardo per sincronizzare l'animazione
  };

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
              {description}
            </p>
          </div>

          {/* Pulsante di acquisto su Amazon */}
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
            onClick={() => window.open("https://www.amazon.it", "_blank")}
          >
            <AmazonIcon style={{ marginRight: "10px" }} />
            Acquista su Amazon
          </button>

          {/* Pulsante minimal per tornare indietro */}
          <div
            onClick={goBack}
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
