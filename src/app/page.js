"use client";

import React from "react";
import ParticlesComponent from "./ParticleComponents";
import AnimatedText from "./AnimatedText";
import ParallaxEffect from "./ParallaxEffect";
import { Button, Typography, Box, IconButton, Link } from "@mui/material";
import { useRouter } from "next/navigation"; // Importa useRouter per il routing
import GitHubIcon from "@mui/icons-material/GitHub"; // Icona GitHub
import CoffeeIcon from "@mui/icons-material/Coffee"; // Icona per BuyMeACoffee
import Head from "next/head";

export default function Home() {
  const router = useRouter(); // Inizializza il router

  // Funzione che viene chiamata quando si clicca "Inizia a esplorare"
  const handleExploreClick = () => {
    router.push("/selectGenre"); // Fai il push al componente di selezione del genere
  };

  return (
    <ParallaxEffect>
      <Head>
        <title>Lumina - Suggeriscimi un libro</title>
        <meta
          name="description"
          content="Scopri storie mai narrate e immergiti in un viaggio letterario senza precedenti. Quale sarà la tua storia in Lumina?"
        />
        <meta
          name="keywords"
          content="storie, letteratura, libri, esplorazione"
        />
        <meta name="author" content="Massimiliano Demiri" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph per i social */}
        <meta property="og:title" content="Lumina - Esplora Storie Uniche" />
        <meta
          property="og:description"
          content="Scopri storie mai narrate e immergiti in un viaggio letterario senza precedenti."
        />
        <meta property="og:image" content="/path/to/your-image.jpg" />
        <meta property="og:url" content="https://lumina.ovh" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lumina - Esplora Storie Uniche" />
        <meta
          name="twitter:description"
          content="Esplora nuove storie in Lumina."
        />
        <meta name="twitter:image" content="/path/to/your-image.jpg" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <div
        style={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >
        {/* Particelle animate */}
        <ParticlesComponent />

        {/* Contenuto principale centrato */}
        <Box
          sx={{
            zIndex: 1,
            color: "#fff",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "24px",
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
              marginBottom: "20px", // Spazio inferiore ridotto
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
              padding: "12px 30px", // Adattato per dispositivi mobile
              fontSize: "16px",
              borderRadius: "30px",
              boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#5a9bd4",
              },
            }}
          >
            Inizia a esplorare
          </Button>

          {/* Footer con nome e icone subito sotto il pulsante */}
          <Box
            sx={{
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "12px", // Spazio tra il pulsante e il footer
              gap: "4px",
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontSize: "14px", color: "#888" }}
            >
              by Massimiliano Demiri
            </Typography>
            <Box sx={{ display: "flex", gap: "10px" }}>
              {/* Icona GitHub */}
              <IconButton
                component={Link}
                href="https://github.com/massimiliano-demiri"
                target="_blank"
                sx={{ color: "#fff", "&:hover": { color: "#90caf9" } }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
              {/* Icona BuyMeACoffee */}
              <IconButton
                component={Link}
                href="https://buymeacoffee.com/massimiliaf"
                target="_blank"
                sx={{ color: "#fff", "&:hover": { color: "#FFDD00" } }}
              >
                <CoffeeIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </div>
    </ParallaxEffect>
  );
}
