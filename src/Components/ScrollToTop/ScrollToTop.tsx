import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
    const { pathname, search, hash } = useLocation();

    useLayoutEffect(() => {
        // We use all parts of the location to ensure a reset even on search/hash changes
        // Using 0,0 instead of just top: 0 for compatibility
        window.scrollTo(0, 0);

        // Sometimes the scroll container is body or html specifically depending on CSS
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }, [pathname, search, hash]);

    return null;
};
