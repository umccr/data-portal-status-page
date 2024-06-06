// Material UI Component
import { Container } from '@mui/material';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
// Custom components
import Routes from './routes';
import NavigationBar from './components/shared/NavigationBar';
import SearchContextProvider from './utils/SearchContextProvider';
import UserContextProvider from './utils/UserContextProvider';
import DialogComponent from './utils/DialogComponent';

function App() {
  return (
    <Box
      aria-label='Base Box'
      sx={{ flexGrow: 1, backgroundColor: grey[50], height: '100vh', minWidth: '500px' }}>
      <DialogComponent>
        <UserContextProvider>
          <SearchContextProvider>
            <NavigationBar />
            {/* <Container maxWidth={false} sx={{ paddingTop: "2rem" }}> */}
            <Container maxWidth={false} sx={{ paddingTop: '2rem' }}>
              <Routes />
            </Container>
          </SearchContextProvider>
        </UserContextProvider>
      </DialogComponent>
    </Box>
  );
}

export default App;
