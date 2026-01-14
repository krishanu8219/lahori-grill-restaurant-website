'use client';

import { useCart } from '@/context/CartContext';

export default function CartItem({ item }) {
    const { dispatch } = useCart();

    const handleIncrement = () => {
        dispatch({ type: 'INCREMENT_ITEM', payload: { id: item.id } });
    };

    const handleDecrement = () => {
        if (item.quantity === 1) {
            dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
        } else {
            dispatch({ type: 'DECREMENT_ITEM', payload: { id: item.id } });
        }
    };

    const handleRemove = () => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
    };

    return (
        <div className="cart-item">
            <div className="cart-item-info">
                <h4 className="cart-item-name">{item.name}</h4>
                <p className="cart-item-price">€{item.price.toFixed(2)}</p>
            </div>

            <div className="cart-item-actions">
                <div className="quantity-controls">
                    <button
                        onClick={handleDecrement}
                        className="quantity-btn"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                        onClick={handleIncrement}
                        className="quantity-btn"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <div className="cart-item-subtotal">
                    €{(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                    onClick={handleRemove}
                    className="cart-item-remove"
                    aria-label="Remove item"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
