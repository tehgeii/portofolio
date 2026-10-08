import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/jetbrains-mono";
import "../index.css";
import "./cv.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CvPage } from "./CvPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CvPage />
  </StrictMode>,
);
