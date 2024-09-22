"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import Lottie from "react-lottie";

// Importa l'animazione Lottie
import loadingAnimation from "../alien.json"; // Aggiungi il file Lottie appropriato

// Generi con la traduzione in italiano
const genres = [
  { id: 1, name: "Fantasy", emoji: "🧙‍♂️", english: "Fantasy" },
  { id: 2, name: "Horror", emoji: "👻", english: "Horror" },
  { id: 3, name: "Mistero", emoji: "🕵️‍♂️", english: "Mystery" },
  { id: 4, name: "Romanzo rosa", emoji: "💖", english: "Romance" },
  { id: 5, name: "Fantascienza", emoji: "🚀", english: "Science Fiction" },
  { id: 6, name: "Romanzo storico", emoji: "🏰", english: "Historical" },
  { id: 7, name: "Avventura", emoji: "🏞️", english: "Adventure" },
  { id: 8, name: "Saggistica", emoji: "📚", english: "Non-fiction" },
  { id: 9, name: "Poesia", emoji: "📜", english: "Poetry" },
  { id: 10, name: "Random", emoji: "🎲", english: "Random" }, // Aggiunto il genere "Random"
];

const SelectGenre = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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
  const handleStartJourney = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Mappiamo i nomi italiani in inglese
      const genresQuery = selectedGenres
        .map((genre) => genres.find((g) => g.name === genre).english)
        .join(",");

      router.push(`/nextComponent?genres=${genresQuery}`);
    }, 3000);
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

            {/* Frasi animate di sfondo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ duration: 2 }}
              style={{
                position: "absolute",
                fontSize: "5rem",
                fontWeight: "bold",
                top: "10%",
                left: "15%",
                color: "#fff",
                zIndex: -1,
                transform: "rotate(-10deg)",
              }}
            >
              "Prepariamo il tuo viaggio..."
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ duration: 3 }}
              style={{
                position: "absolute",
                fontSize: "4rem",
                fontWeight: "bold",
                top: "60%",
                right: "20%",
                color: "#fff",
                zIndex: -1,
                transform: "rotate(5deg)",
              }}
            >
              "Attendi un momento..."
            </motion.div>

            {/* Emoji selezionate in rotazione ellittica sotto Lottie */}
            {selectedGenres.length > 0 && (
              <motion.div
                style={{
                  position: "absolute",
                  width: "300px",
                  height: "300px",
                  top: "60%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  borderRadius: "50%",
                  perspective: 800,
                }}
                variants={orbitAnimation}
                initial="initial"
                animate="animate"
              >
                {selectedGenres.map((genre, index) => (
                  <motion.div
                    key={index}
                    style={{
                      fontSize: "2rem",
                      transform: `rotateY(${index * 40}deg) translateZ(100px)`,
                    }}
                  >
                    {genres.find((g) => g.name === genre)?.emoji}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <Lottie
            options={defaultOptions}
            height={400}
            width={400}
            style={{ marginTop: "20px" }}
          />
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

          <Grid container spacing={3} justifyContent="center">
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
                      height: 110, // Ingrandisco leggermente le card per evitare che il testo trabocchi
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
                    <CardContent>
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{
                          scale: selectedGenres.includes(genre.name) ? 1.1 : 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#fff",
                            fontWeight: "bold",
                            letterSpacing: "0.1em",
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
