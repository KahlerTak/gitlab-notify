import React from "react";
import {createRoot} from "react-dom/client";
import Popup from "./frontend/popup"; // Import der Options-Komponente


const rootElement = document.getElementById("root");
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<Popup />);
}
