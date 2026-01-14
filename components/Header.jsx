'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CartIcon from './Cart/CartIcon';
import CartDrawer from './Cart/CartDrawer';
import { getStoreStatus } from '@/lib/storeStatus';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [storeStatus, setStoreStatus] = useState({ isOpen: true, statusText: '', nextOpen: '' });

    useEffect(() => {
        setStoreStatus(getStoreStatus());
        const interval = setInterval(() => {
            setStoreStatus(getStoreStatus());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

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
                        {storeStatus.isOpen ? (
                            <Link href="/menu" className="btn-order-now">
                                ORDINA ORA
                            </Link>
                        ) : (
                            <button className="btn-order-now closed" disabled title={storeStatus.nextOpen}>
                                NEGOZIO CHIUSO
                            </button>
                        )}
                        <Link href="/menu" className="btn-menu-header">
                            MENU
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
                    <Link href="/#about" onClick={closeMenu}>Chi Siamo</Link>
                    <Link href="/menu" onClick={closeMenu}>Menu</Link>
                    <Link href="/checkout" onClick={closeMenu}>Carrello</Link>
                    <Link href="/#contact" onClick={closeMenu}>Contatti</Link>
                </div>
            </header>

            <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
}
