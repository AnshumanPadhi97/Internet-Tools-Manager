import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@mantine/core/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  fontFamily: "Roboto",
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </React.StrictMode>
);
