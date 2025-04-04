import React, {useEffect} from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {HashRouter as Router, Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import i18next from "i18next";
import ConfigurationSettings from "../storage/ConfigurationSettings";
import {OptionsRoutes} from "./routes";
import theme from "./theme"
import ThemeProvider from '@mui/system/ThemeProvider';


const Options: React.FC = () => {
    const {t} = useTranslation();

    useEffect(() => {
        const setup = async () => {
            const config = await ConfigurationSettings.Load();
            await i18next.changeLanguage(config.Language);
        }

        setup().then();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Box sx={{display: 'flex'}}>
                    <CssBaseline/>
                    <AppBar style={{
                        zIndex: 1301
                    }}
                    >
                        <Toolbar>
                            <IconButton color="inherit" edge="start" sx={{mr: 2}}>
                                <img src="extension-icon-128.png" alt="Brand Logo" style={{width: 60, height: 60}}/>
                            </IconButton>
                            <Typography variant="h6">{t("welcome")}</Typography>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        sx={{
                            width: 240,
                            flexShrink: 0,
                            '& .MuiDrawer-paper': {
                                width: 240,
                                boxSizing: 'border-box',
                            },
                            marginTop: 8,
                            paddingTop: 8
                        }}
                        variant="permanent"
                        anchor="left"
                    >
                        <List sx={{
                            marginTop: 8
                        }}>
                            <ListItemButton component={Link} to="/settings">
                                <ListItemText primary={t("navigation.settings")}/>
                            </ListItemButton>
                            <ListItemButton component={Link} to="/about">
                                <ListItemText primary={t("navigation.about")}/>
                            </ListItemButton>
                        </List>
                    </Drawer>

                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            bgcolor: 'background.default',
                            p: 3,
                            marginTop: 8,
                        }}
                    >
                        <OptionsRoutes/>
                    </Box>
                </Box>
            </Router>
        </ThemeProvider>
    );
};

export default Options;
