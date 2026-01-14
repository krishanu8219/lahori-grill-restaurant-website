'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart, calculateTotal } from '@/context/CartContext';

export default function StickyCartBar() {
    const { state } = useCart();
    const pathname = usePathname();

    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    const total = calculateTotal(state.items);

    // Don't show if cart is empty
    if (itemCount === 0) return null;

    // Homepage: below header. Other pages: at top (replacing header)
    const isHomePage = pathname === '/';
    const positionClass = isHomePage ? 'sticky-cart-bar sticky-cart-below-header' : 'sticky-cart-bar sticky-cart-top';

    return (
        <div className={positionClass}>
            <div className="sticky-cart-content">
                <div className="sticky-cart-info">
                    <span className="sticky-cart-icon">🛒</span>
                    <span className="sticky-cart-count">{itemCount} {itemCount === 1 ? 'articolo' : 'articoli'}</span>
                    <span className="sticky-cart-separator">·</span>
                    <span className="sticky-cart-total">€{total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="sticky-cart-btn">
                    Vai al Checkout →
                </Link>
            </div>
        </div>
    );
}

