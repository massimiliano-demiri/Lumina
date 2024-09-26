import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Lumina - Discover Hidden Literary Gems",
  description:
    "Lumina helps you explore and reveal book excerpts, offering a unique and captivating experience in literature discovery.",
  keywords: "book excerpts, literature, discover books, hidden gems, Lumina",
  author: "InnovaWebConsulting",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={'w-screen h-screen'}>
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta name="author" content={metadata.author} />
        <meta name="viewport" content={metadata.viewport} />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}
      >
        {children}
      </body>
    </html>
  );
}
