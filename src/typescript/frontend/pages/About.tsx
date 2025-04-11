import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import {t} from "i18next";
import {usePageTitle} from "../hooks/pageTitle";
import type {SxProps} from "@mui/material";

const bodyStyle:SxProps = {
    marginBottom: 4,
}

const contentStyle:SxProps = {
    padding: 2,
}
const About = () => {
    usePageTitle(t("about.headline"))

    return (
        <Paper sx={contentStyle}>
            <Typography typography="h5">{t("about.titles.description")}</Typography>
            <Typography typography="body1" sx={bodyStyle}>{t("about.body.description")}</Typography>
            <Typography typography="h5">{t("about.titles.legals")}</Typography>
            <Typography typography="body1" sx={bodyStyle}>{t("about.body.legals")}</Typography>
            <Typography typography="h5">{t("about.titles.license")}</Typography>
            <Typography typography="body1" sx={bodyStyle}>{t("about.body.license")}</Typography>
        </Paper>
    );
};

export default About;
