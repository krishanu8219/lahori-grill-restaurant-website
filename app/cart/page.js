'use client';

import Link from 'next/link';
import { useCart, calculateTotal } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function CartPage() {
    const { state, dispatch } = useCart();
    const total = calculateTotal(state.items);
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    const handleIncrement = (id) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: { id } });
    };

    const handleDecrement = (item) => {
        if (item.quantity === 1) {
            dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
        } else {
            dispatch({ type: 'DECREMENT_ITEM', payload: { id: item.id } });
        }
    };

    const handleRemove = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { id } });
    };

    return (
        <>
            <Header />
            <main className="cart-page">
                <div className="cart-page-container">
                    <h1 className="cart-page-title">
                        🛒 Il Tuo Carrello
                    </h1>

                    {state.items.length === 0 ? (
                        <div className="cart-empty-state">
                            <div className="cart-empty-icon">🛒</div>
                            <h2>Il carrello è vuoto</h2>
                            <p>Aggiungi qualcosa di delizioso dal nostro menu!</p>
                            <Link href="/menu" className="btn-add-items">
                                Vai al Menu
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items-list-mobile">
                                {state.items.map(item => (
                                    <div key={item.id} className="cart-item-card">
                                        <div className="cart-item-card-header">
                                            <h3 className="cart-item-card-name">{item.name}</h3>
                                            <button
                                                onClick={() => handleRemove(item.id)}
                                                className="cart-item-remove-btn"
                                                aria-label="Rimuovi"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        <div className="cart-item-card-body">
                                            <span className="cart-item-card-price">
                                                €{item.price.toFixed(2)} cad.
                                            </span>

                                            <div className="cart-item-qty-controls">
                                                <button
                                                    onClick={() => handleDecrement(item)}
                                                    className="qty-btn-mobile"
                                                >
                                                    −
                                                </button>
                                                <span className="qty-value-mobile">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrement(item.id)}
                                                    className="qty-btn-mobile"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        <div className="cart-item-card-footer">
                                            <span className="cart-item-subtotal-label">Subtotale:</span>
                                            <span className="cart-item-subtotal-value">
                                                €{(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary-mobile">
                                <div className="cart-summary-row">
                                    <span>Articoli:</span>
                                    <span>{itemCount}</span>
                                </div>
                                <div className="cart-summary-row cart-summary-total">
                                    <span>Totale:</span>
                                    <span className="cart-total-amount">€{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="cart-actions-mobile">
                                <Link href="/checkout" className="btn-checkout-mobile">
                                    Procedi al Checkout →
                                </Link>
                                <Link href="/menu" className="btn-continue-mobile">
                                    ← Continua lo Shopping
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
