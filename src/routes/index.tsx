import { Route, Switch, Redirect } from 'react-router-dom';
import NotFound from '../pages/NotFound';
import SequencePage from '../pages/SequencePage';
import LibraryRunPage from '../pages/LibraryRunPage';
import WorkflowsPage from '../pages/WorkflowsPage';
import AuthenticatedRoute from '../utils/AuthenticatedRoute';

// Declaring Routes
// Route: can be access regardless auth/unauth
// AuthenticatedRoute: Only Accessed when authenticated

export default function Routes() {
  return (
    <Switch>
      <Route exact path='/'>
        <Redirect to='/sequence' />
      </Route>
      <AuthenticatedRoute exact path='/sequence'>
        <SequencePage />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path='/libraryrun'>
        <LibraryRunPage />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path='/workflows'>
        <WorkflowsPage />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
