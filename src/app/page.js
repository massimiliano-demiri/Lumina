"use client"; // Aggiungi questa direttiva per indicare che il componente è client-side

import React from "react";
import ParticlesComponent from "./ParticleComponents"; // Sfondo delle particelle
import AnimatedText from "./AnimatedText"; // Testo animato
import ParallaxEffect from "./ParallaxEffect"; // Effetto parallasse
import { Button, Typography, Box } from "@mui/material"; // Usa Material UI

export default function Home() {
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
        <ParticlesComponent /> {/* Sfondo delle pagine fluttuanti */}
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
              animation: "fadeIn 1s ease-out forwards",
            }}
          >
            Benvenuto in Lumina {/* Testo statico in italiano */}
          </Typography>

          {/* Testo animato con frasi che cambiano */}
          <AnimatedText />

          {/* Descrizione in piccolo, non dominante */}
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
            tua? {/* Testo statico in italiano */}
          </Typography>

          {/* Pulsante per esplorare */}
          <Button
            variant="contained"
            size="large"
            href="/explore"
            sx={{
              backgroundColor: "#90caf9",
              color: "#121212",
              padding: "14px 36px",
              fontSize: "16px",
              borderRadius: "30px",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              transform: "translateY(0)",
              "&:hover": {
                backgroundColor: "#5a9bd4",
                transform: "translateY(-4px)",
                boxShadow: "0px 12px 40px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            Inizia a esplorare {/* Testo statico in italiano */}
          </Button>
        </Box>
      </div>
    </ParallaxEffect>
  );
}
