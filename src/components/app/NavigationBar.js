import React, { useEffect, useState } from "react";

// AWS-amplify
import { Auth, Hub } from "aws-amplify";

// React Router Dom
import { Link as RouterLink } from "react-router-dom";

// Material UI Components
import { styled } from "@mui/material/styles";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  InputBase,
  Link,
  Box,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

// Custom Components
import { useUserContext } from "../utils/UserContextProvider";
import { useSearchContext } from "../utils/SearchContextProvider";
import { useDialogContext } from "../utils/DialogComponent";

const DATA_PORTAL_CLIENT_DOMAIN =
  "data." + process.env.REACT_APP_UMCCR_DOMAIN_NAME;

const ROUTER_LINK_BUTTON = [
  {
    name: "UMCCR",
    routerLink: "/",
    typographyVariant: "h6",
  },
  {
    name: "Workflows",
    link: "/workflows",
  },
  {
    name: "Sequence",
    routerLink: "/sequence",
  },
  {
    name: "Library Run",
    routerLink: "/libraryrun",
  },
  {
    name: "Data Portal",
    link: "https://" + DATA_PORTAL_CLIENT_DOMAIN,
  },
];

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

function navbarLinkButton(linkInformation) {
  return (
    <>
      {linkInformation.routerLink ? (
        <Button
          color="primary"
          LinkComponent={RouterLink}
          to={linkInformation.routerLink}
          sx={{
            margin: "0 10px 0 10px",
            color: "black",
            textTransform: "none",
          }}
        >
          <Typography
            variant={
              linkInformation.typographyVariant
                ? linkInformation.typographyVariant
                : "subtitle1"
            }
            component="div"
          >
            {linkInformation.name}
          </Typography>
        </Button>
      ) : (
        <Button
          color="primary"
          LinkComponent={Link}
          href={linkInformation.link}
          sx={{
            color: "black",
            margin: "0 10px 0 10px",
            textTransform: "none",
          }}
        >
          <Typography
            variant={
              linkInformation.typographyVariant
                ? linkInformation.typographyVariant
                : "subtitle1"
            }
            component="div"
          >
            {linkInformation.name}
          </Typography>
        </Button>
      )}
    </>
  );
}

function NavigationBar(props) {
  const [searchInput, setSearchInput] = useState("");
  const { user, setUser } = useUserContext();
  const { searchHandler } = useSearchContext();
  const { setDialogInfo } = useDialogContext();

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
  }, [setUser]);

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
  }, [setUser]);

  const onSearchClick = () => {
    searchHandler(searchInput);
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  return (
    <AppBar position="static" color="transparent">
      <Toolbar>
        {/* Smaller Screen (Hamburger menu item will appear) */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            {ROUTER_LINK_BUTTON.map((buttonLink, index) => (
              <MenuItem key={index} onClick={handleCloseNavMenu}>
                {navbarLinkButton(buttonLink)}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Links for larger screen */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
          }}
        >
          {ROUTER_LINK_BUTTON.map((buttonLink, index) => (
            <div key={index}>{navbarLinkButton(buttonLink)}</div>
          ))}
        </Box>

        <Search
          sx={{
            display: "flex",
            flexGrow: { xs: 1, md: 0 },
          }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            onKeyPress={(e) => e.key === "Enter" && onSearchClick()}
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            aria-label="HelpIconButton"
            onClick={() =>
              setDialogInfo({
                isOpen: true,
                dialogTitle: "Search Bar Information",
                dialogContent:
                  "Search anything inside the libraryrun information!\n" +
                  "Search field available: id, library_id, instrument_run_id, run_id, lane, override_cycles, coverage_yield, qc_pass, qc_status, valid_for_analysis, workflows.",
              })
            }
            sx={{ right: "1rem" }}
          >
            <HelpOutlineRoundedIcon />
          </IconButton>
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
