import React, { useState, useEffect } from "react";

// Material UI Component
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { grey } from "@mui/material/colors";

// Custom components
import Routes from "./Routes";
import NavigationBar from "./components/app/NavigationBar";
import SearchContextProvider from "./components/higherOrderComponent/SearchContextProvider";
import UserContextProvider from "./components/higherOrderComponent/UserContextProvider";
import ErrorContextProvider from "./components/higherOrderComponent/ErrorContextProvider";

function App() {
  return (
    <Box
      aria-label="Base Box"
      sx={{ flexGrow: 1, backgroundColor: grey[50], height: "100vh" }}
    >
      <UserContextProvider>
        <SearchContextProvider>
          <ErrorContextProvider>
            <NavigationBar />
            <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
              <Routes />
            </Container>
          </ErrorContextProvider>
        </SearchContextProvider>
      </UserContextProvider>
    </Box>
  );
}

export default App;
