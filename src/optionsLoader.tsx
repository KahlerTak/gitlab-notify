import React from "react";
import Options from "./frontend/options";
import {createRoot} from "react-dom/client";
import i18next from "i18next";
import i18nextHttpBackend from "i18next-http-backend";
import {initReactI18next} from "react-i18next";

i18next
    .use(i18nextHttpBackend)
    .use(initReactI18next)
    .init({
        lng: 'en', // Standard-Sprache
        fallbackLng: 'en', // Fallback-Sprache, wenn keine Übersetzung für die gewählte Sprache vorhanden ist
        backend: {
            loadPath: '/i18n/{{lng}}.json', // Pfad zu den Übersetzungsdateien
        },
    }).then(
        () => {
            const rootElement = document.getElementById("root");
            if (rootElement) {
                const root = createRoot(rootElement);
                root.render(<Options />);
            }
    });

