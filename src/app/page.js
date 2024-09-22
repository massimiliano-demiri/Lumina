"use client";

import React from "react";
import ParticlesComponent from "./ParticleComponents";
import AnimatedText from "./AnimatedText";
import ParallaxEffect from "./ParallaxEffect";
import { Button, Typography, Box } from "@mui/material";
import { useRouter } from "next/navigation"; // Importa useRouter per il routing

export default function Home() {
  const router = useRouter(); // Inizializza il router

  // Funzione che viene chiamata quando si clicca "Inizia a esplorare"
  const handleExploreClick = () => {
    router.push("/selectGenre"); // Fai il push al componente di selezione del genere
  };

  return (
    <ParallaxEffect>
      <div
        style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ParticlesComponent />
        <Box
          sx={{
            zIndex: 1,
            position: "relative",
            color: "#fff",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
            padding: "0 20px",
            width: "100%",
            transform: "translate(var(--parallax-x), var(--parallax-y))",
            transition: "transform 0.1s ease-out",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: "bold",
              color: "#ffffff",
              marginBottom: "16px",
              letterSpacing: "0.05em",
            }}
          >
            Benvenuto in Lumina
          </Typography>

          <AnimatedText />

          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontSize: "18px",
              color: "#ccc",
              marginBottom: "40px",
              maxWidth: "600px",
              lineHeight: "1.5",
            }}
          >
            I frammenti del tempo nascondono storie mai narrate. Quale sarà la
            tua?
          </Typography>

          {/* Pulsante per iniziare l'esplorazione */}
          <Button
            variant="contained"
            size="large"
            onClick={handleExploreClick} // Chiama la funzione al click
            sx={{
              backgroundColor: "#90caf9",
              color: "#121212",
              padding: "14px 36px",
              fontSize: "16px",
              borderRadius: "30px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#5a9bd4",
              },
            }}
          >
            Inizia a esplorare
          </Button>
        </Box>
      </div>
    </ParallaxEffect>
  );
}
