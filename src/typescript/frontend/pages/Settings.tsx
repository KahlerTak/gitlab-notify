import React, {useEffect, useState} from "react";
import i18next, {t} from "i18next";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Alert from "../components/Alert";
import ConfigurationSettings, {Language} from "../../storage/ConfigurationSettings";
import StringUtils from "../../uitls/StringUtils";
import {usePageTitle} from "../hooks/pageTitle";
import type {SxProps} from "@mui/material";
import GitlabApiClient from "../../gitlab/api/v4/GitlabClient";


class SettingsActions {
    public static async SafeOptions(gitlabHostname: string, apiToken: string, language: Language) {
        const config = new ConfigurationSettings();
        config.Hostname = gitlabHostname;
        config.ApiToken = apiToken;
        config.Language = language;
        await config.Store();
    }
}

const textFieldStyle: SxProps = {
    maxWidth: 300,
    marginBottom: 2,
};
const buttonStyle: SxProps = {
    maxWidth: 150,
    marginBottom: 2,
};

const Settings = () => {
    // Settings
    const [apiToken, setApiToken] = useState<string | undefined>(undefined);
    const [gitlabHost, setGitlabHost] = useState<string | undefined>(undefined);
    const [language, setLanguage] = useState<Language>("en");
    const [_, setPageTitle] = usePageTitle(t("settings.headline"));

    // Alerts
    const [alertOpen, setAlertOpen] = useState<boolean>();
    const [alertSeverity, setAlertSeverity] = useState<"error"|"success">("success");
    const [alertTextKey, setAlertTextKey] = useState<string>("");

    const onSave = async () => {
        const gitlabClient = new GitlabApiClient();
        gitlabClient.configure(gitlabHost ?? "", apiToken ?? "");

        try {
            await gitlabClient.getCurrentUser();
        } catch {
            setAlertOpen(true);
            setAlertSeverity("error");
            setAlertTextKey("settings.alerts.invalid-credentials");
            return;
        }

        await SettingsActions.SafeOptions(gitlabHost ?? "", apiToken ?? "", language ?? "en")
        setAlertOpen(true);
        setAlertSeverity("success");
        setAlertTextKey("settings.alerts.saved");
        await i18next.changeLanguage(language);
        setPageTitle(t("settings.headline"))
    };

    useEffect(() => {
        const setup = async () => {
            return await ConfigurationSettings.Load();
        };

        setLanguage("en");

        setup().then((configurationSettings) => {
            if (!StringUtils.isNullOrWhitespace(configurationSettings.Hostname)) {
                setGitlabHost(configurationSettings.Hostname);
            }

            if (!StringUtils.isNullOrWhitespace(configurationSettings.ApiToken)) {
                setApiToken(configurationSettings.ApiToken);
            }

            setLanguage(configurationSettings.Language);
        })
    }, []);

    return (
        <Paper variant="outlined" sx={{
            width: "100%",
            padding: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
        }}>
            <Typography variant="h6">{t("settings.headline")}</Typography>
            <Alert message={t(alertTextKey)} severity={alertSeverity} open={alertOpen ?? false}
                   onClose={() => setAlertOpen(false)}/>
            <InputLabel id="hostname-label" htmlFor="hostname-input">{t("settings.labels.hostname")}</InputLabel>
            <TextField id="hostname-input"
                       variant="filled"
                       helperText={t("settings.hints.hostname")}
                       aria-readonly={false}
                       placeholder="gitlab.example.com"
                       fullWidth={false}
                       sx={textFieldStyle}
                       value={gitlabHost}
                       onChange={x => setGitlabHost(x.target.value)}
            />
            <InputLabel id="api-token-label" htmlFor="api-token-input">{t("settings.labels.apiToken")}</InputLabel>
            <TextField id="api-token-input"
                       variant="filled"
                       helperText={t("settings.hints.apiToken")}
                       placeholder="glpat-xxxxxxxxxxxxxxx_xxxxx"
                       type="password"
                       fullWidth={false}
                       sx={textFieldStyle}
                       value={apiToken}
                       onChange={x => setApiToken(x.target.value)}
            />


            <InputLabel id="language-select-label">{t("settings.labels.language")}</InputLabel>
            {/*<Typography variant="caption">{t("settings.label.apiToken")}</Typography>*/}
            <Select variant="filled"
                    fullWidth={false}
                    sx={textFieldStyle}
                    label={t("language.current")}
                    value={language}
                    labelId="language-select-label"
                    onChange={(e) => {
                        setLanguage(e.target.value as Language)
                    }}
            >
                <MenuItem value="en">{t("language.english")}</MenuItem>
                <MenuItem value="de">{t("language.german")}</MenuItem>
            </Select>

            <Button variant="contained"
                    sx={buttonStyle}
                    color="primary"
                    fullWidth={false}
                    onClick={onSave}>{t("settings.buttons.save")}</Button>
        </Paper>
    );
};

export default Settings;
