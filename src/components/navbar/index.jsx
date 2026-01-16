"use client";
import React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "background.paper" }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/landing"
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            ContextGPT
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button component={Link} href="/features" color="inherit">
              Features
            </Button>
            <Button component={Link} href="/integration" color="inherit">
              Integration
            </Button>
            <Button component={Link} href="/aboutus" color="inherit">
              About Us
            </Button>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              disableElevation
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
