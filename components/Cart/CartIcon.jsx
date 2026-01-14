'use client';

import { useCart, getTotalItems } from '@/context/CartContext';

export default function CartIcon({ onClick }) {
    const { state } = useCart();
    const itemCount = getTotalItems(state.items);

    return (
        <button
            onClick={onClick}
            className="cart-icon-btn"
            aria-label={`Shopping cart with ${itemCount} items`}
        >
            <svg
                className="cart-icon-svg"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>
            {itemCount > 0 && (
                <span className="cart-badge">{itemCount}</span>
            )}
        </button>
    );
}
