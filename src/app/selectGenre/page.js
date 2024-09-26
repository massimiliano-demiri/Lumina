"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Slider,
  useMediaQuery,
} from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "react-lottie";
import loadingAnimation from "./libri.json"; // Animazione Lottie
import bookData from "./book.json"; // Dati dei libri

// Generi con icone (rimosso "Non-fiction")
const genres = [
  { id: 1, name: "Fantasy", displayName: "Fantasia", emoji: "🧙‍♂️" },
  { id: 2, name: "Horror", displayName: "Orrore", emoji: "👻" },
  { id: 3, name: "Mystery", displayName: "Mistero", emoji: "🕵️‍♂️" },
  { id: 4, name: "Romance", displayName: "Romantico", emoji: "💖" },
  { id: 5, name: "Science Fiction", displayName: "Fantascienza", emoji: "🚀" },
  { id: 6, name: "Historical", displayName: "Storico", emoji: "🏰" },
  { id: 7, name: "Adventure", displayName: "Avventura", emoji: "🏞️" },
  { id: 8, name: "Poetry", displayName: "Poesia", emoji: "📜" },
  { id: 9, name: "Random", displayName: "Casuale", emoji: "🎲" },
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
      if (selectedGenres.length < 3 && !selectedGenres.includes("Random")) {
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
    const genresQuery = selectedGenres.join(","); // Aggiungi i generi selezionati alla query

    console.log("Generi selezionati:", selectedGenres); // Log dei generi
    console.log("ID dei libri:", bookIds); // Log degli ID dei libri

    router.push(`/nextComponent?ids=${idsQuery}&genres=${genresQuery}`); // Passa gli ID dei libri e i generi selezionati
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
        justifyContent: "space-around",
        height: "100%",
        width: "100%",
        padding: isMobile ? "1rem" : "2rem",
        color: "#fff",
        backgroundColor: "#121212",
        overflowY: "hidden", // Disabilita lo scrolling verticale
      }}
    >
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <Lottie
            options={defaultOptions}
            height={isMobile ? 150 : 350}
            width={isMobile ? 150 : 350}
          />
        </Box>
      )}

      {!isLoading && (
        <>
          {/* Scritta iniziale o emoticon a seconda della selezione */}
          {selectedGenres.length === 0 ? (
            <motion.div
                className={'h-[10%]'}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h5"
                sx={{
                  marginBottom: "0.8rem",
                  fontWeight: "bold",
                  color: "#90caf9",
                  letterSpacing: "0.05em",
                  fontSize: isMobile ? "1.4rem" : "2rem",
                }}
              >
                Scegli fino a 3 generi!
              </Typography>
            </motion.div>
          ) : (
            <motion.div
                className={'h-[10%]'}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h6"
                sx={{
                  marginBottom: "0.8rem",
                  color: "#bbdefb",
                  fontSize: isMobile ? "1.5rem" : "2rem",
                }}
              >
                {typedEmojis}
                {selectedGenres.length < 3 &&
                  !selectedGenres.includes("Random") &&
                  cursorVisible && (
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
          <Grid container spacing={1} justifyContent="center" height={"40%"}>
            {genres.map((genre) => (
              <Grid item key={genre.id} xs={4} sm={4}>
                <motion.div
                    className={"h-full"}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: genre.id * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    onClick={() => handleGenreClick(genre.name)}
                    sx={{
                      height: '100%',
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
                      border:
                        genre.name === "Random"
                          ? "1px solid rgba(255, 215, 0, 0.6)" // Bordo dorato più tenue per Random
                          : "none", // Nessun bordo per gli altri generi
                    }}
                  >
                    <CardContent sx={{ padding: "8px", textAlign: "center" }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          letterSpacing: "0.05em",
                          fontSize: isMobile ? "0.7rem" : "0.8rem",
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
              className={'w-full flex flex-col items-center'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className={"w-4/5 flex flex-col items-center gap-2"}
            >
              <Typography
                variant="body1"
                sx={{ color: "#90caf9", fontWeight: "bold", textAlign: "center" }}
              >
                Periodo
              </Typography>
              <Slider
                value={yearRange}
                onChange={handleYearChange}
                valueLabelDisplay="auto"
                valueLabelFormat={(x) => `${x}`}
                min={1900}
                max={2023}
                sx={{ color: "#7986cb"}}
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
                {yearRange[0]} - {yearRange[1]}
              </Typography>
            </div>
          </motion.div>

          {/* Bottone per iniziare il viaggio */}
          {selectedGenres.length > 0 ? (
            <motion.div
                className={"h-[10%]"}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#7986cb",
                  color: "#fff",
                  padding: "8px 18px",
                  fontSize: isMobile ? "12px" : "14px",
                  borderRadius: "30px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#5c6bc0",
                  },
                }}
                onClick={handleStartJourney}
              >
                Inizia il tuo viaggio!
              </Button>
            </motion.div>
          ):<div className={"h-[10%]"}></div>}
        </>
      )}
    </Box>
  );
};

export default SelectGenre;
