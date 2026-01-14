'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

function OrderConfirmationContent() {
    const searchParams = useSearchParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const orderData = searchParams.get('data');
        if (orderData) {
            try {
                setOrder(JSON.parse(decodeURIComponent(orderData)));
            } catch (e) {
                console.error('Failed to parse order data:', e);
            }
        }
    }, [searchParams]);

    if (!order) {
        return (
            <div className="confirmation-loading">
                <p>Caricamento...</p>
            </div>
        );
    }

    return (
        <div className="confirmation-content">
            <div className="confirmation-icon">✓</div>
            <h1>Ordine Confermato!</h1>
            <p className="confirmation-message">
                Grazie per il tuo ordine. Ti abbiamo inviato una conferma.
            </p>

            <div className="confirmation-details">
                <div className="confirmation-row">
                    <span>Numero Ordine:</span>
                    <strong>{order.id}</strong>
                </div>
                <div className="confirmation-row">
                    <span>Nome:</span>
                    <span>{order.customer_name}</span>
                </div>
                <div className="confirmation-row">
                    <span>Telefono:</span>
                    <span>{order.phone}</span>
                </div>
                <div className="confirmation-row">
                    <span>Tipo Ordine:</span>
                    <span>{order.order_type === 'delivery' ? '🚚 Consegna' : '🏪 Ritiro'}</span>
                </div>
                {order.address && (
                    <div className="confirmation-row">
                        <span>Indirizzo:</span>
                        <span>{order.address}</span>
                    </div>
                )}
                <div className="confirmation-row">
                    <span>Pagamento:</span>
                    <span>
                        {order.payment_method === 'cash' ? '💵 Contanti' : '💳 Carta/Bancomat'}
                    </span>
                </div>
            </div>

            <div className="confirmation-items">
                <h3>Articoli Ordinati</h3>
                {order.items.map((item, index) => (
                    <div key={index} className="confirmation-item">
                        <span>{item.quantity}x {item.name}</span>
                        <span>€{(item.unit_price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
                <div className="confirmation-total">
                    <span>Totale</span>
                    <strong>€{order.total_price.toFixed(2)}</strong>
                </div>
            </div>

            <Link href="/menu" className="btn-primary">
                Ordina di Nuovo
            </Link>
        </div>
    );
}

export default function OrderConfirmation() {
    return (
        <>
            <Header />
            <main className="confirmation-page-container">
                <Suspense fallback={<div className="confirmation-loading"><p>Caricamento...</p></div>}>
                    <OrderConfirmationContent />
                </Suspense>
            </main>
            <Footer />
        </>
    );
}
