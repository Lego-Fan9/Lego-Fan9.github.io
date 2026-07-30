import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    const location = useLocation();

    useEffect(() => {
        if (!window.goatcounter) return;

        window.goatcounter.count({
            path: location.pathname + location.search,
            title: document.title,
        });
    }, [location]);

    return null;
}