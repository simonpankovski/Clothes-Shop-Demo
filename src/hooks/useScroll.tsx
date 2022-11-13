import { useEffect, useState } from "react";

export default function useScroll() {
    const [isInitialPosition, setIsInitialPosition] = useState(false);

    useEffect(() => {
        const onScroll = () => window.pageYOffset > 0 ? setIsInitialPosition(true) : setIsInitialPosition(false);
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return isInitialPosition;
}
