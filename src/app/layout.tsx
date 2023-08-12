"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AppBar, Box, Button, CssBaseline, Toolbar } from "@mui/material";
import store from "../storage/store";
import  { Provider } from "react-redux";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const metadata: Metadata = {
  title: "Github Search",
  description: "GitHub Repository Search app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Github Repository Search</title>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={inter.className}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
              <Toolbar sx={{ 
                  display: "flex",
                  justifyContent: "space-between",}}>
                <Button color="inherit"><Link href="/" shallow={true} className="route-link">Search</Link></Button>
                <Button color="inherit"><Link href="/favorites" shallow={true} className="route-link">Favorites</Link></Button>
              </Toolbar>
            </AppBar>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minHeight: "100vh",
                flexDirection: "column",
                pt: 12,
              }}>
              {children}
            </Box>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
