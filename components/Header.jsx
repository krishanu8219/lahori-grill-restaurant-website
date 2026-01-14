'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CartIcon from './Cart/CartIcon';
import CartDrawer from './Cart/CartDrawer';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };

    const closeCart = () => {
        setIsCartOpen(false);
    };

    return (
        <>
            <header className="header" id="header">
                <nav className="nav">
                    <Link href="/menu" className="locations-btn">
                        <span>MENU</span>
                    </Link>
                    <Link href="/" className="logo">
                        <Image
                            src="/logo.png"
                            alt="Lahori Grill Logo"
                            width={180}
                            height={70}
                            className="logo-img"
                            priority
                        />
                    </Link>
                    <div className="nav-right">
                        <Link href="/menu" className="btn-order-now">
                            ORDER NOW
                        </Link>
                        <CartIcon onClick={toggleCart} />
                        <button
                            className="menu-toggle"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </nav>

                <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
                    <Link href="/" onClick={closeMenu}>Home</Link>
                    <Link href="/#about" onClick={closeMenu}>About</Link>
                    <Link href="/menu" onClick={closeMenu}>Menu</Link>
                    <Link href="/checkout" onClick={closeMenu}>Cart</Link>
                    <Link href="/#contact" onClick={closeMenu}>Contact</Link>
                </div>
            </header>

            <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
}
