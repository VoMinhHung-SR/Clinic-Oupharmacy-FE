import { useEffect } from "react";

const ExternalRedirect = ({ url, replace = false }) => {
    useEffect(() => {
        if (replace) {
            window.location.replace(url);
        } else {
            window.location.href = url;
        }
    }, [url, replace]);
    return null;
};

export default ExternalRedirect;