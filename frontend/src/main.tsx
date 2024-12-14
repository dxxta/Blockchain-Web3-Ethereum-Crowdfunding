import {
  createTheme,
  MantineColorsTuple,
  MantineProvider,
} from "@mantine/core";
import { ReactNode, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ContractProvider } from "./context/Contract.tsx";
import { ImageViewerProvider } from "./context/ImageViewer.tsx";
import { StorageContextProvider } from "./context/Storage.tsx";
import App from "./App.tsx";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "./index.css";
import { NavigationProgress } from "@mantine/nprogress";
import { Notifications } from "@mantine/notifications";

const blackColor = "#000000";
const primary: MantineColorsTuple = [
  "#f7ffe2",
  "#f0ffcc",
  "#e1ff9a",
  "#d1ff64",
  "#c3ff38",
  "#bbff1c",
  "#b5fc0e",
  "#b6ff09",
  "#9fe300",
  "#8cca00",
];
const dark: MantineColorsTuple = [
  "#dedede",
  "#bebebe",
  "#9e9e9e",
  "#808080",
  "#636363",
  "#484848",
  "#2e2e2e",
  "#161616",
  "#030303",
  "#000000",
];
const light: MantineColorsTuple = [
  "#e8e8e8",
  "#eaeaea",
  "#ededed",
  "#efefef",
  "#f1f1f1",
  "#f3f3f3",
  "#f6f6f6",
  "#f8f8f8",
  "#fafafa",
  "#fdfdfd",
];
const customTheme = createTheme({
  black: blackColor,
  luminanceThreshold: 0.3,
  primaryColor: "primary",
  autoContrast: true,
  defaultRadius: 0,
  colors: {
    primary,
    dark,
    light,
  },
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "100em",
  },
  fontFamily:
    "JetBrains Mono, Helvetica, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji",
});

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MantineProvider defaultColorScheme="auto" theme={customTheme}>
      {children}
    </MantineProvider>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ContractProvider>
          <ImageViewerProvider>
            <StorageContextProvider>
              <NavigationProgress />
              <Notifications position="top-right" />
              <App />
            </StorageContextProvider>
          </ImageViewerProvider>
        </ContractProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
