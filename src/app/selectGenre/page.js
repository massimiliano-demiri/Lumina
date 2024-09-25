"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useMediaQuery,
  Button,
  Slider,
} from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import loadingAnimation from "./libri.json"; // Animazione Lottie
import bookData from "./book.json"; // Dati dei libri

// Generi con icone
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

// Simulazione fetch libri
const fetchBookIdsByGenres = async (selectedGenres) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (selectedGenres.includes("Random")) {
        const allBookIds = Object.values(bookData)
          .flat()
          .map((book) => book.id);
        resolve(allBookIds);
      } else {
        const bookIds = selectedGenres.flatMap((genre) => {
          if (bookData[genre]) {
            return bookData[genre].map((book) => book.id);
          }
          return [];
        });
        resolve(bookIds);
      }
    }, 2000);
  });
};

const SelectGenre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [typedEmojis, setTypedEmojis] = useState(""); // Emojis mostrate
  const [isLoading, setIsLoading] = useState(false);
  const [yearRange, setYearRange] = useState([1900, 2023]);
  const [cursorVisible, setCursorVisible] = useState(true); // Stato per il cursore lampeggiante
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");

  // Funzione per selezionare un genere
  const handleGenreClick = (genre) => {
    if (genre === "Random") {
      if (selectedGenres.includes("Random")) {
        setSelectedGenres([]);
      } else {
        setSelectedGenres(["Random"]);
      }
    } else if (!selectedGenres.includes(genre) && selectedGenres.length < 3) {
      setSelectedGenres((prevGenres) =>
        prevGenres.includes(genre)
          ? prevGenres.filter((g) => g !== genre)
          : [...prevGenres, genre]
      );
    } else if (selectedGenres.includes(genre)) {
      setSelectedGenres((prevGenres) => prevGenres.filter((g) => g !== genre));
    }
  };

  useEffect(() => {
    // Mostra il cursore lampeggiante finché non ci sono 3 generi
    const cursorInterval = setInterval(() => {
      if (selectedGenres.length < 3) {
        setCursorVisible((prev) => !prev);
      }
    }, 500); // Il cursore lampeggia ogni 500ms

    return () => clearInterval(cursorInterval);
  }, [selectedGenres]);

  useEffect(() => {
    // Aggiorna le emoticon con effetto typing
    const emojisToShow = selectedGenres.includes("Random")
      ? "🎲🎲🎲"
      : selectedGenres
          .map((genre) => genres.find((g) => g.name === genre)?.emoji)
          .join(" ");

    setTypedEmojis(emojisToShow); // Aggiunge le emoticon selezionate
  }, [selectedGenres]);

  const handleStartJourney = async () => {
    setIsLoading(true);
    const bookIds = await fetchBookIdsByGenres(selectedGenres);
    const idsQuery = bookIds.join(",");
    router.push(`/nextComponent?ids=${idsQuery}`);
  };

  const handleYearChange = (event, newValue) => {
    setYearRange(newValue);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        padding: "1rem",
        color: "#fff",
        backgroundColor: "#121212",
        overflowY: "auto",
      }}
    >
      {isLoading && (
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
      )}

      {!isLoading && (
        <>
          {/* Scritta iniziale o emoticon a seconda della selezione */}
          {selectedGenres.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginBottom: "1rem",
                  fontWeight: "bold",
                  color: "#90caf9",
                  letterSpacing: "0.05em",
                }}
              >
                Cosa ti piace leggere? Scegli fino a 3 generi!
              </Typography>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "1rem",
                  color: "#bbdefb",
                  fontSize: "2rem",
                }}
              >
                {typedEmojis}
                {selectedGenres.length < 3 && cursorVisible && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "1ch", // Mantiene lo spazio anche quando il cursore è invisibile
                      color: cursorVisible ? "#90caf9" : "transparent",
                    }}
                  >
                    |
                  </span>
                )}
              </Typography>
            </motion.div>
          )}

          {/* Generi */}
          <Grid container spacing={1} justifyContent="center">
            {genres.map((genre) => (
              <Grid item key={genre.id} xs={6} sm={4}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: genre.id * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    onClick={() => handleGenreClick(genre.name)}
                    sx={{
                      height: 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "12px",
                      backgroundImage: selectedGenres.includes(genre.name)
                        ? "linear-gradient(135deg, #7986cb, #5c6bc0)"
                        : "linear-gradient(135deg, #303f9f, #283593)",
                      transition: "all 0.4s ease",
                      boxShadow: selectedGenres.includes(genre.name)
                        ? "0px 8px 16px rgba(121, 134, 203, 0.7)"
                        : "0px 6px 12px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <CardContent sx={{ padding: "8px", textAlign: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          letterSpacing: "0.05em",
                          fontSize: "0.8rem",
                        }}
                      >
                        {genre.emoji} {genre.displayName}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Filtro per selezionare l'anno */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{ width: "80%", marginBottom: "1rem", marginTop: "1.5rem" }}
            >
              <Typography
                variant="body1"
                sx={{ color: "#90caf9", fontWeight: "bold" }}
              >
                Seleziona un intervallo di anni:
              </Typography>
              <Slider
                value={yearRange}
                onChange={handleYearChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(x) => `${x}`}
                min={1900}
                max={2023}
                sx={{ color: "#7986cb", marginBottom: "1rem" }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#90caf9",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                }}
              >
                Intervallo: {yearRange[0]} - {yearRange[1]}
              </Typography>
            </Box>
          </motion.div>

          {/* Bottone per iniziare il viaggio */}
          {selectedGenres.length > 0 && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#7986cb",
                  color: "#fff",
                  padding: "10px 24px",
                  fontSize: "14px",
                  borderRadius: "30px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#5c6bc0",
                  },
                  marginTop: "20px",
                }}
                onClick={handleStartJourney}
              >
                Inizia il tuo viaggio!
              </Button>
            </motion.div>
          )}
        </>
      )}
    </Box>
  );
};

export default SelectGenre;
