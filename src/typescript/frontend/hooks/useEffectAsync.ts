import {DependencyList, useEffect} from "react";

export default function usePageTitle(effect: () => Promise<void>, depList?: DependencyList): void {
    useEffect(() => {
        effect().then();
    }, depList);
}
