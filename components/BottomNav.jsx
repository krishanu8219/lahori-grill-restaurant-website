'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function BottomNav() {
    const pathname = usePathname();
    const { state } = useCart();

    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        { href: '/', label: 'Home', icon: '🏠' },
        { href: '/menu', label: 'Menu', icon: '📋' },
        { href: '/cart', label: 'Carrello', icon: '🛒', showBadge: true },
        { href: '/#contact', label: 'Contatti', icon: '📞' },
    ];

    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-items">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`bottom-nav-item ${pathname === item.href ? 'active' : ''}`}
                    >
                        <span className={`bottom-nav-icon ${item.showBadge ? 'bottom-nav-cart-badge' : ''}`}>
                            {item.icon}
                            {item.showBadge && itemCount > 0 && (
                                <span className="bottom-nav-badge">{itemCount > 9 ? '9+' : itemCount}</span>
                            )}
                        </span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
