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
      <AuthenticatedRoute exact path="/">
        <StatusPage />
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
