import React, {useState} from "react";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import NotificationSettings from "../../storage/NotificationSettings";
import useEffectAsync from "../hooks/useEffectAsync";
import {t} from "i18next";
import Button from "@mui/material/Button";
import type {SxProps} from "@mui/material";
import Typography from "@mui/material/Typography";
import Alert from "../components/Alert";


const buttonStyle: SxProps = {
    maxWidth: 150,
    marginBottom: 2,
};


export default () => {
    const [newReviewMergeRequests, setNewReviewMergeRequests] = useState<boolean>(true);
    const [updateReviewMergeRequests, setUpdateReviewMergeRequests] = useState<boolean>(true);
    const [newCommentOnOwnMergeRequest, setNewCommentOnOwnMergeRequest] = useState<boolean>(true);
    const [updatedCommentOnOwnMergeRequest, setUpdatedCommentOnOwnMergeRequest] = useState<boolean>(true);

    // Alerts
    const [alertOpen, setAlertOpen] = useState<boolean>();
    const [alertSeverity, setAlertSeverity] = useState<"error"|"success">("success");
    const [alertTextKey, setAlertTextKey] = useState<string>("");


    const onSave = async () => {
        const settings = await NotificationSettings.Load();
        await settings.SetEnabled("new-review-merge-request", newReviewMergeRequests);
        await settings.SetEnabled("update-review-merge-request", updateReviewMergeRequests);
        await settings.SetEnabled("new-comment-on-own-merge-request", newCommentOnOwnMergeRequest);
        await settings.SetEnabled("updated-comment-on-own-merge-request", updatedCommentOnOwnMergeRequest)
        await settings.Store();

        setAlertOpen(true);
        setAlertTextKey("settings.notifications.saved");
        setAlertSeverity("success");
    }

    useEffectAsync(async () => {
        const settings = await NotificationSettings.Load();
        setNewReviewMergeRequests(await settings.IsNotificationEnabled("new-review-merge-request"));
        setUpdateReviewMergeRequests(await settings.IsNotificationEnabled("update-review-merge-request"));
        setNewCommentOnOwnMergeRequest(await settings.IsNotificationEnabled("new-comment-on-own-merge-request"));
        setUpdatedCommentOnOwnMergeRequest(await settings.IsNotificationEnabled("updated-comment-on-own-merge-request"));
    }, []);
    console.log("Devmode: ", __DEV__);
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
            <FormGroup>
                <FormControlLabel label={t("notifications.labels.new_review_merge_request")} control={<Checkbox
                    checked={newReviewMergeRequests}
                    onChange={x => setNewReviewMergeRequests(x.target.checked)} />} />
                <FormControlLabel label={t("notifications.labels.update_review_merge_request")} control={<Checkbox
                    checked={updateReviewMergeRequests}
                    onChange={x => setUpdateReviewMergeRequests(x.target.checked)}/>} />
                <FormControlLabel label={t("notifications.labels.new_comment_own_merge_request")} control={<Checkbox
                    checked={newCommentOnOwnMergeRequest}
                    onChange={x => setNewCommentOnOwnMergeRequest(x.target.checked)}/>} />
                <FormControlLabel label={t("notifications.labels.update_comment_own_merge_request")} control={<Checkbox
                    checked={updatedCommentOnOwnMergeRequest}
                    onChange={x => setUpdatedCommentOnOwnMergeRequest(x.target.checked)} />} />
            </FormGroup>

            <Button variant="contained"
                    sx={buttonStyle}
                    color="primary"
                    fullWidth={false}
                    onClick={onSave}>{t("settings.buttons.save")}</Button>
        </Paper>
    );
}
