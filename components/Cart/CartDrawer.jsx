'use client';

import { useCart, calculateTotal } from '@/context/CartContext';
import CartItem from './CartItem';
import Link from 'next/link';

export default function CartDrawer({ isOpen, onClose }) {
    const { state } = useCart();
    const total = calculateTotal(state.items);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`cart-backdrop ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`cart-drawer ${isOpen ? 'active' : ''}`}>
                <div className="cart-drawer-header">
                    <h2>Il Tuo Carrello</h2>
                    <button onClick={onClose} className="cart-close-btn" aria-label="Close cart">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="cart-drawer-content">
                    {state.items.length === 0 ? (
                        <div className="cart-empty">
                            <svg className="cart-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p>Il tuo carrello è vuoto</p>
                            <button onClick={onClose} className="btn-primary">
                                Continua lo Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items-list">
                                {state.items.map(item => (
                                    <CartItem key={item.id} item={item} />
                                ))}
                            </div>

                            <div className="cart-drawer-footer">
                                <div className="cart-total">
                                    <span>Totale</span>
                                    <span className="cart-total-price">€{total.toFixed(2)}</span>
                                </div>
                                <Link href="/checkout" className="btn-checkout" onClick={onClose}>
                                    Procedi al Checkout
                                </Link>
                                <button onClick={onClose} className="btn-continue-shopping">
                                    Continua lo Shopping
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
