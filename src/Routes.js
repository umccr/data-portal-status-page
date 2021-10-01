import React from "react";
import { Route, Switch } from "react-router-dom";
import NotFound from "./pages/NotFound";
import StatusPage from "./pages/StatusPage";

// Declaring Routes
// Route: can be access regardless auth/unauth

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <StatusPage />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
