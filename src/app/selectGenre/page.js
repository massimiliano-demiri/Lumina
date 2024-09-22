"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import loadingAnimation from "./libri.json"; // Importa l'animazione Lottie
import bookData from "./book.json"; // Importa il file JSON con i dati dei libri

// Generi con la traduzione in italiano
const genres = [
  { id: 1, name: "Fantasy", emoji: "🧙‍♂️" },
  { id: 2, name: "Horror", emoji: "👻" },
  { id: 3, name: "Mistero", emoji: "🕵️‍♂️" },
  { id: 4, name: "Romanzo rosa", emoji: "💖" },
  { id: 5, name: "Fantascienza", emoji: "🚀" },
  { id: 6, name: "Romanzo storico", emoji: "🏰" },
  { id: 7, name: "Avventura", emoji: "🏞️" },
  { id: 8, name: "Saggistica", emoji: "📚" },
  { id: 9, name: "Poesia", emoji: "📜" },
  { id: 10, name: "Random", emoji: "🎲" },
];

// Simulazione di un'API che restituisce ID dei libri
const fetchBookIdsByGenres = async (selectedGenres) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Estrai gli ID dei libri per i generi selezionati
      const bookIds = selectedGenres.flatMap((genre) => {
        // Se esiste il genere nel JSON, estrai gli ID
        if (bookData[genre]) {
          return bookData[genre].map((book) => book.id); // Estrarre solo gli ID
        }
        return [];
      });
      resolve(bookIds); // Restituisci solo gli ID
    }, 2000); // Simula un ritardo per il fetch
  });
};

const SelectGenre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Gestione del click sul genere
  const handleGenreClick = (genre) => {
    if (genre === "Random") {
      if (selectedGenres.includes("Random")) {
        setSelectedGenres([]);
      } else {
        setSelectedGenres(["Random"]);
      }
    } else {
      if (!selectedGenres.includes("Random")) {
        setSelectedGenres((prevGenres) =>
          prevGenres.includes(genre)
            ? prevGenres.filter((g) => g !== genre)
            : [...prevGenres, genre]
        );
      }
    }
  };

  // Funzione per iniziare il viaggio
  // Funzione per iniziare il viaggio
  const handleStartJourney = async () => {
    setIsLoading(true);

    // Recupera gli ID dei libri in base ai generi selezionati
    const bookIds = await fetchBookIdsByGenres(selectedGenres);

    // Unisci gli ID dei libri in una stringa separata da virgole
    const idsQuery = bookIds.join(",");

    // Naviga al componente successivo, passando solo gli ID dei libri
    router.push(`/nextComponent?ids=${idsQuery}`);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const orbitAnimation = {
    initial: { rotate: 0 },
    animate: { rotate: 360 },
    transition: { repeat: Infinity, duration: 10, ease: "linear" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        color: "#fff",
        backgroundColor: "#121212",
        overflow: "hidden",
        position: "relative",
        padding: "1rem",
      }}
    >
      {isLoading && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "radial-gradient(circle, #121212 30%, #1c1c1c 60%, #121212)",
              zIndex: -1,
              overflow: "hidden",
            }}
          >
            {/* Sfondo dinamico con particelle */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.05 }}
              transition={{
                yoyo: Infinity,
                duration: 2,
                ease: "easeInOut",
              }}
              style={{
                position: "absolute",
                width: "200%",
                height: "200%",
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 60%)",
                top: "-50%",
                left: "-50%",
                zIndex: -2,
                opacity: 0.3,
              }}
            />
          </motion.div>

          <Box
            sx={{
              display: "flex",
              alignItems: "center", // Centra verticalmente
              justifyContent: "center", // Centra orizzontalmente
              height: "100vh", // Imposta l'altezza dell'intera viewport
              width: "100%", // Assicura che occupi tutta la larghezza
            }}
          >
            <Lottie
              options={defaultOptions}
              height={isMobile ? 200 : 400}
              width={isMobile ? 200 : 400}
            />
          </Box>
        </>
      )}

      {!isLoading && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant="h5"
              sx={{
                marginBottom: "2rem",
                fontWeight: "bold",
                color: "#90caf9",
                letterSpacing: "0.05em",
              }}
            >
              {selectedGenres.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: "flex", gap: "10px" }}
                >
                  {selectedGenres.map((genre) => (
                    <span key={genre} style={{ fontSize: "1.5rem" }}>
                      {genres.find((g) => g.name === genre)?.emoji}
                    </span>
                  ))}
                </motion.div>
              ) : (
                "Scegli i tuoi generi preferiti"
              )}
            </Typography>
          </motion.div>

          <Grid container spacing={2} justifyContent="center">
            {genres.map((genre) => (
              <Grid item key={genre.id} xs={6} sm={4} md={3}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: genre.id * 0.1 }}
                  whileHover={{ rotate: 3 }}
                  whileTap={{ scale: 0.95, rotate: 0 }}
                >
                  <Card
                    onClick={() => handleGenreClick(genre.name)}
                    sx={{
                      height: 80, // Altezza ridotta del riquadro
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      backgroundImage: selectedGenres.includes(genre.name)
                        ? "linear-gradient(135deg, #ff7e5f, #feb47b)"
                        : "linear-gradient(135deg, #333, #444)",
                      transition: "all 0.4s ease",
                      boxShadow: selectedGenres.includes(genre.name)
                        ? "0px 8px 16px rgba(255, 126, 95, 0.7)"
                        : "0px 6px 12px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <CardContent sx={{ padding: "8px" }}>
                      {" "}
                      {/* Riduci il padding */}
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{
                          scale: selectedGenres.includes(genre.name) ? 1.1 : 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1" // Riduci la dimensione del testo
                          sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            letterSpacing: "0.05em",
                            fontSize: "0.9rem", // Riduci la dimensione del font
                          }}
                        >
                          {genre.emoji} {genre.name}
                        </Typography>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {selectedGenres.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ marginTop: "2rem" }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor: "#ff7e5f",
                    border: "none",
                    color: "#121212",
                    padding: "14px 36px",
                    fontSize: "16px",
                    borderRadius: "30px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onClick={handleStartJourney}
                >
                  Inizia il tuo viaggio!
                </motion.button>
              </Box>
            </motion.div>
          )}
        </>
      )}
    </Box>
  );
};

export default SelectGenre;
