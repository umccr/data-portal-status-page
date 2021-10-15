import React, { useState, useEffect } from "react";


// Material UI Component
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { grey } from "@mui/material/colors";

// Custom components
import Routes from "./Routes";
import { UserContext, SearchQueryContext } from "./components/utils/ContextLib";
import NavigationBar from "./components/app/NavigationBar";

function App() {
  const [user, setUser] = useState(null);
  const [searchQueryState, setSearchQueryState] = useState({});

  return (
    <Box
      aria-label="Base Box"
      sx={{ flexGrow: 1, backgroundColor: grey[50], height: "100vh" }}
    >
      <UserContext.Provider value={{ user, setUser }}>
        <NavigationBar />
        <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
          <SearchQueryContext.Provider
            value={{ searchQueryState, setSearchQueryState }}
          >
            <Routes />
          </SearchQueryContext.Provider>
        </Container>
      </UserContext.Provider>
    </Box>
  );
}

export default App;
