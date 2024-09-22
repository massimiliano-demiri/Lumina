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

// Generi con nomi italiani per le card e nomi inglesi per la mappatura JSON
const genres = [
  { id: 1, name: "Fantasy", displayName: "Fantasia", emoji: "🧙‍♂️" },
  { id: 2, name: "Horror", displayName: "Orrore", emoji: "👻" },
  { id: 3, name: "Mystery", displayName: "Mistero", emoji: "🕵️‍♂️" },
  { id: 4, name: "Romance", displayName: "Romantico", emoji: "💖" },
  { id: 5, name: "Science Fiction", displayName: "Fantascienza", emoji: "🚀" },
  { id: 6, name: "Historical", displayName: "Storico", emoji: "🏰" },
  { id: 7, name: "Adventure", displayName: "Avventura", emoji: "🏞️" },
  { id: 8, name: "Non-fiction", displayName: "Non-fiction", emoji: "📚" },
  { id: 9, name: "Poetry", displayName: "Poesia", emoji: "📜" },
  { id: 10, name: "Random", displayName: "Casuale", emoji: "🎲" },
];

// Funzione che restituisce gli ID dei libri per i generi selezionati
const fetchBookIdsByGenres = async (selectedGenres) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (selectedGenres.includes("Random")) {
        // Se "Random" è selezionato, restituisci tutti gli ID dei libri dal JSON
        const allBookIds = Object.values(bookData)
          .flat()
          .map((book) => book.id);
        resolve(allBookIds);
      } else {
        // Altrimenti, estrai gli ID dei libri solo per i generi selezionati
        const bookIds = selectedGenres.flatMap((genre) => {
          if (bookData[genre]) {
            return bookData[genre].map((book) => book.id); // Estrai solo gli ID
          }
          return [];
        });
        resolve(bookIds);
      }
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
      // Se si seleziona "Random", deseleziona tutti gli altri generi
      if (selectedGenres.includes("Random")) {
        setSelectedGenres([]); // Deseleziona "Random"
      } else {
        setSelectedGenres(["Random"]); // Seleziona solo "Random"
      }
    } else {
      // Se un altro genere è selezionato e "Random" non è selezionato
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
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
              width: "100%",
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
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{
                          scale: selectedGenres.includes(genre.name) ? 1.1 : 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            letterSpacing: "0.05em",
                            fontSize: "0.9rem",
                          }}
                        >
                          {genre.emoji} {genre.displayName}
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
