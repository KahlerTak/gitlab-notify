import React from "react";
import {Alert as MuiAlert, Collapse, IconButton} from "@mui/material";
import Close from "@mui/icons-material/Close";

export type CollapsableAlertProps = {
    open: boolean;
    onClose: () => void;
    severity: "warning" | "success" | "info" | "error" ;
    message: string;
}

const Alert = (props: CollapsableAlertProps) => {
    return (
        <Collapse in={props.open}>
            <MuiAlert
                severity={props.severity}
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => props.onClose()}
                    >
                        <Close fontSize="inherit" />
                    </IconButton>
                }
            >
                {props.message}
            </MuiAlert>
        </Collapse>
    );
};

Alert.defaultProps = {
    severity: "warning",
    message: "",
    onClose: () => {},
    open: true
}

export default Alert;
