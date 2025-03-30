import {Dispatch, SetStateAction, useEffect, useState} from "react";

export function usePageTitle(title: string): [string, Dispatch<SetStateAction<string>>] {
    const [pageTitle, setPageTitle] = useState<string>(title);
    useEffect(() => {
        setPageTitle(title);
        document.title = title;
    }, [pageTitle]);

    return [pageTitle, setPageTitle];
}
