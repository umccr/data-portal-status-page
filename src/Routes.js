import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SequencePage from "./pages/SequencePage";
import MetadataPage from "./pages/MetadataPage";
import AuthenticatedRoute from "./components/higherOrderComponent/AuthenticatedRoute";

// Declaring Routes
// Route: can be access regardless auth/unauth
// AuthenticatedRoute: Only Accessed when authenticated

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/sequence" />
      </Route>
      <AuthenticatedRoute exact path="/sequence">
        <SequencePage />
      </AuthenticatedRoute>
      <AuthenticatedRoute exact path="/metadata">
        <MetadataPage />
      </AuthenticatedRoute>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
