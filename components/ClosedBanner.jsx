'use client';

import { useState, useEffect } from 'react';
import { getStoreStatus } from '@/lib/storeStatus';

export default function ClosedBanner() {
    const [isDismissed, setIsDismissed] = useState(false);
    const [storeStatus, setStoreStatus] = useState({ isOpen: true, nextOpen: null });

    useEffect(() => {
        // Check if already dismissed this session
        const dismissed = sessionStorage.getItem('closedBannerDismissed');
        if (dismissed) setIsDismissed(true);

        // Get store status
        setStoreStatus(getStoreStatus());

        // Update every minute
        const interval = setInterval(() => {
            setStoreStatus(getStoreStatus());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleDismiss = () => {
        setIsDismissed(true);
        sessionStorage.setItem('closedBannerDismissed', 'true');
    };

    // Don't show if open or dismissed
    if (storeStatus.isOpen || isDismissed) return null;

    return (
        <div className="closed-banner">
            <div className="closed-banner-content">
                <span className="closed-banner-icon">🔒</span>
                <div className="closed-banner-text">
                    <strong>Siamo chiusi al momento</strong>
                    <span>{storeStatus.nextOpen}</span>
                </div>
            </div>
            <button
                onClick={handleDismiss}
                className="closed-banner-close"
                aria-label="Chiudi banner"
            >
                ✕
            </button>
        </div>
    );
}
