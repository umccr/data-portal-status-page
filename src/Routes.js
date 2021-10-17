import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./pages/NotFound";
import StatusPage from "./pages/StatusPage";
import MetadataPage from "./pages/MetadataPage";
import AuthenticatedRoute from "./components/higherOrderComponent/AuthenticatedRoute";

// Declaring Routes
// Route: can be access regardless auth/unauth

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <AuthenticatedRoute>
          <StatusPage />
        </AuthenticatedRoute>
      </Route>
      <Route exact path="/metadata">
        <AuthenticatedRoute>
          <MetadataPage />
        </AuthenticatedRoute>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
