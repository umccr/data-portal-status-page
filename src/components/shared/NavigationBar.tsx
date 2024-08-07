import React, { useEffect, useState } from 'react';

// AWS-amplify
import { Hub } from 'aws-amplify/utils';
import { getCurrentUser, signOut, signInWithRedirect } from 'aws-amplify/auth';
// React Router Dom
import { Link as RouterLink } from 'react-router-dom';

// Material UI Components
// import { styled } from '@mui/material/styles';
import styled from '@mui/material/styles/styled';
//import { AppBar, Toolbar, Button, Typography, InputBase, Link, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import grey from '@mui/material/colors/grey';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import Box from '@mui/material/Box';

// Custom Components
import { useUserContext } from '../../utils/UserContextProvider';
import { useSearchContext } from '../../utils/SearchContextProvider';
import { useDialogContext } from '../../utils/DialogComponent';

// Remove `prod` from Domain Name
const domain_name = import.meta.env.VITE_UMCCR_DOMAIN_NAME?.replace('prod.', '');
// use the new portal at portal.dev.umccr.org replace old "data.dev.umccr.org"
const DATA_PORTAL_CLIENT_DOMAIN = 'portal.' + domain_name;

const ROUTER_LINK_BUTTON = [
  {
    name: 'UMCCR',
    routerLink: '/',
    typographyVariant: 'h6',
  },

  {
    name: 'Sequence',
    routerLink: '/sequence',
  },
  {
    name: 'Library Run',
    routerLink: '/libraryrun',
  },
  {
    name: 'Workflows',
    link: '/workflows',
  },
  {
    name: 'Data Portal',
    link: 'https://' + DATA_PORTAL_CLIENT_DOMAIN,
  },
];

// Styling Componentss
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: grey[200],
  '&:hover': {
    backgroundColor: grey[300],
  },
  marginLeft: 0,
  marginRight: 25,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function navbarLinkButton(linkInformation: any) {
  return (
    <>
      {linkInformation.routerLink ? (
        <Button
          color='primary'
          component={RouterLink}
          to={linkInformation.routerLink}
          sx={{
            margin: '0 10px 0 10px',
            color: 'black',
            textTransform: 'none',
          }}>
          <Typography
            variant={
              linkInformation.typographyVariant ? linkInformation.typographyVariant : 'subtitle1'
            }
            component='div'>
            {linkInformation.name}
          </Typography>
        </Button>
      ) : (
        <Button
          color='primary'
          component={Link}
          href={linkInformation.link}
          sx={{
            color: 'black',
            margin: '0 10px 0 10px',
            textTransform: 'none',
          }}>
          <Typography
            variant={
              linkInformation.typographyVariant ? linkInformation.typographyVariant : 'subtitle1'
            }
            component='div'>
            {linkInformation.name}
          </Typography>
        </Button>
      )}
    </>
  );
}

function NavigationBar() {
  const [searchInput, setSearchInput] = useState('');
  const { user, setUser } = useUserContext() as any;
  const { searchHandler } = useSearchContext() as any;
  const setDialogInfo = useDialogContext();

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event } }) => {
      switch (event) {
        case 'signInWithRedirect':
          getUser().then((userData) => setUser(userData));
          break;
        case 'signedOut':
          setUser(null);
          break;
        // case "signIn_failure":
        // case "cognitoHostedUI_failure":
        default:
      }
    });

    getUser().then((userData) => {
      setUser(userData);
    });
  }, [setUser]);

  async function getUser() {
    return await getCurrentUser()
      .then((userData) => userData)
      .catch(() => console.log('Not signed in'));
  }

  async function handleLogout() {
    try {
      // Remove custome values in local storage
      // Warning: clear all local storage will disable Auth.signOut function.
      localStorage.removeItem('StatusColumnDisplay');
      localStorage.removeItem('workflowColumnDisplay');

      await signOut({ global: true });
      setUser(null);
    } catch (e) {
      console.error('Error signing out: ', e);
    }
  }

  useEffect(() => {
    async function onLoad() {
      try {
        getUser().then((userData) => setUser(userData));
      } catch (e) {
        if (e !== 'No current user') {
          console.error('Error getting user: ', e);
        }
      }
    }
    onLoad();
  }, [setUser]);

  const onSearchClick = () => {
    searchHandler(searchInput);
  };

  const [anchorElNav, setAnchorElNav] = React.useState<(EventTarget & Element) | null>(null);
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event: React.SyntheticEvent) => {
    setAnchorElNav(event.currentTarget);
  };
  return (
    <AppBar position='static' color='transparent'>
      <Toolbar>
        {/* Smaller Screen (Hamburger menu item will appear) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size='large'
            aria-label='account of current user'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleOpenNavMenu}
            color='inherit'>
            <MenuIcon />
          </IconButton>
          <Menu
            id='menu-appbar'
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}>
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
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
          }}>
          {ROUTER_LINK_BUTTON.map((buttonLink, index) => (
            <div key={index}>{navbarLinkButton(buttonLink)}</div>
          ))}
        </Box>

        <Search
          sx={{
            display: 'flex',
            flexGrow: { xs: 1, md: 0 },
          }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder='Search…'
            inputProps={{ 'aria-label': 'search' }}
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
            onKeyPress={(e) => e.key === 'Enter' && onSearchClick()}
            sx={{ flexGrow: 1 }}
          />
          <IconButton
            aria-label='HelpIconButton'
            onClick={() =>
              setDialogInfo({
                isOpen: true,
                dialogTitle: 'Search Bar Information',
                dialogContent:
                  'Search anything inside the libraryrun information!\n' +
                  'Search field available: id, library_id, instrument_run_id, run_id, lane, override_cycles, coverage_yield, qc_pass, qc_status, valid_for_analysis, workflows.',
              })
            }
            sx={{ right: '1rem' }}>
            <HelpOutlineRoundedIcon />
          </IconButton>
        </Search>

        {user ? (
          <Button onClick={handleLogout}>Logout</Button>
        ) : (
          <Button onClick={() => signInWithRedirect({ provider: 'Google' })}>Login</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
