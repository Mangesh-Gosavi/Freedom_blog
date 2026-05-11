import { useCallback, useRef, useState } from "react";

export function useLoading(initial = false) {
    const [loading, setLoading] = useState(initial);
    const inFlight = useRef(false);

    const withLoading = useCallback(async (fn) => {
        if (inFlight.current) return;
        inFlight.current = true;
        setLoading(true);
        try {
            return await fn();
        } finally {
            inFlight.current = false;
            setLoading(false);
        }
    }, []);

    return { loading, withLoading };
}

export function useKeyedLoading() {
    const [loadingKeys, setLoadingKeys] = useState(() => new Set());
    const inFlight = useRef(new Set());

    const isLoading = useCallback((key) => loadingKeys.has(key), [loadingKeys]);

    const withLoading = useCallback(async (key, fn) => {
        if (inFlight.current.has(key)) return;
        inFlight.current.add(key);
        setLoadingKeys((prev) => {
            const next = new Set(prev);
            next.add(key);
            return next;
        });
        try {
            return await fn();
        } finally {
            inFlight.current.delete(key);
            setLoadingKeys((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        }
    }, []);

    return { isLoading, withLoading };
}
