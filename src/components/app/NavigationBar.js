import React, { useEffect } from "react";

// AWS-amplify
import { Auth, Hub } from "aws-amplify";

// React Router Dom
import { Link as RouterLink } from "react-router-dom";

// Material UI Components
import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Button, Typography, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { grey } from "@mui/material/colors";

// Custom Components
import { useUserContext } from "../utils/ContextLib";


// Styling Componentss
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: grey[200],
  "&:hover": {
    backgroundColor: grey[300],
  },
  marginLeft: 0,
  marginRight: 25,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

function NavigationBar(props) {
  const { user, setUser } = useUserContext();

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
        default:
      }
    });

    getUser().then((userData) => {
      setUser(userData);
    });
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log("Not signed in"));
  }

  async function handleLogout() {
    await Auth.signOut({ global: true });
    setUser(false);
  }

  useEffect(() => {
    async function onLoad() {
      try {
        await Auth.currentSession();
        getUser().then((userData) => setUser(userData));
      } catch (e) {
        if (e !== "No current user") {
        }
      }
    }
    onLoad();
  }, []);

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        <div
          style={{
            flex: 1,
          }}
        >
          <Button
            color="primary"
            LinkComponent={RouterLink}
            to="/"
            sx={{
              color: "black",
            }}
          >
            <Typography variant="h6" component="div">
              UMCCR
            </Typography>
          </Button>
        </div>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
          />
        </Search>
        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
