import { useEffect } from "react";

declare global {
    interface Window {
        goatcounter?: {
            count: (options?: {
                path?: string;
                title?: string;
                referrer?: string;
                event?: boolean;
                no_session?: boolean;
            }) => void;
        };
    }
}

export default function GoatCounter() {
    const { pathname, search } = window.location;

    useEffect(() => {
        if (!window.goatcounter) return;

        window.goatcounter.count({
            path: pathname + search,
            title: document.title,
        });
    }, [location]);

    return null;
}