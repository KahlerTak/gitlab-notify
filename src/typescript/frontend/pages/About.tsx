import React from "react";
import {Paper, SxProps, Typography} from "@mui/material";
import {t} from "i18next";

const bodyStyle:SxProps = {
    marginBottom: 4,
}

const contentStyle:SxProps = {
    padding: 2,
}
const About = () => {
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
