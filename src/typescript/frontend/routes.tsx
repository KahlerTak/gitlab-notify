import {Navigate, Route, Routes} from "react-router-dom";
import Settings from "./pages/Settings";
import About from "./pages/About";
import React from "react";


export const OptionsRoutes = () => {
    return (
    <Routes>
        <Route index element={<Settings/>}/>
        <Route path="/settings" element={<Settings/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="*" element={<Navigate to="/settings" replace/>}/>
    </Routes>
    )
}
