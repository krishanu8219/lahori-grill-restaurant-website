'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CheckoutForm from '@/components/Checkout/CheckoutForm';
import { useCart, calculateTotal } from '@/context/CartContext';
import Link from 'next/link';

export default function Checkout() {
    const { state } = useCart();
    const router = useRouter();
    const total = calculateTotal(state.items);

    // Redirect to menu if cart is empty
    useEffect(() => {
        if (state.items.length === 0) {
            // Small delay to allow cart to load from localStorage
            const timer = setTimeout(() => {
                if (state.items.length === 0) {
                    router.push('/menu');
                }
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [state.items, router]);

    if (state.items.length === 0) {
        return (
            <>
                <Header />
                <main className="checkout-page-container">
                    <div className="checkout-empty">
                        <h1>Il tuo carrello è vuoto</h1>
                        <Link href="/menu" className="btn-primary">
                            Vai al Menu
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <main className="checkout-page-container">
                <div className="checkout-wrapper">
                    <div className="checkout-main">
                        <h1>Checkout</h1>
                        <CheckoutForm />
                    </div>

                    <aside className="checkout-sidebar">
                        <div className="order-summary">
                            <h2>Riepilogo Ordine</h2>
                            <div className="order-items">
                                {state.items.map((item) => (
                                    <div key={item.id} className="order-item">
                                        <span className="order-item-qty">{item.quantity}x</span>
                                        <span className="order-item-name">{item.name}</span>
                                        <span className="order-item-price">€{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-total">
                                <span>Totale</span>
                                <span>€{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
            <Footer />
        </>
    );
}
