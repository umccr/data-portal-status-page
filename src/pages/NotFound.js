import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div style={{ height: "100vh" }}>
      <Typography variant="h5" align="center" sx={{ paddingTop: "100px" }}>
        Sorry, page not found!
      </Typography>
      <Typography align="center" sx={{ paddingTop: "25px" }}>
      <Link
        variant="h1" align="center"
        sx={{ fontSize: "16px" }}
        component={RouterLink}
        to="/"
      >
        HOMEPAGE
      </Link>
      </Typography>
    </div>
  );
}
