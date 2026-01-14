'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function MenuItem({ item }) {
    const { state, dispatch } = useCart();

    // Check if item is in cart and get quantity
    const cartItem = state.items.find(i => i.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        dispatch({
            type: 'ADD_ITEM',
            payload: {
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
            },
        });
    };

    const handleIncrement = () => {
        dispatch({ type: 'INCREMENT_ITEM', payload: { id: item.id } });
    };

    const handleDecrement = () => {
        if (quantity === 1) {
            dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
        } else {
            dispatch({ type: 'DECREMENT_ITEM', payload: { id: item.id } });
        }
    };

    return (
        <div className="delicious-menu-item">
            {/* Image Container */}
            <div className="menu-item-image-wrapper">
                <div className="menu-item-image-box">
                    <Image
                        src={item.image || '/hero-food.png'}
                        alt={item.name}
                        width={120}
                        height={120}
                        className="menu-food-img"
                        loading="lazy"
                        quality={75}
                    />
                </div>

                {/* Add to Cart overlay */}
                {quantity === 0 ? (
                    <button onClick={handleAddToCart} className="btn-add-overlay">
                        +
                    </button>
                ) : (
                    <div className="item-qty-overlay">
                        <button onClick={handleDecrement} className="qty-btn-mini">−</button>
                        <span className="qty-val">{quantity}</span>
                        <button onClick={handleIncrement} className="qty-btn-mini">+</button>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="delicious-menu-content">
                <div className="menu-item-header-row">
                    <h3 className="delicious-item-name">{item.name}</h3>
                    {item.isTopSeller && (
                        <span className="item-badge-seasonal">SEASONAL</span>
                    )}
                    {item.isNew && (
                        <span className="item-badge-new">NEW</span>
                    )}
                </div>

                <div className="menu-item-price-line">
                    <span className="connecting-dots"></span>
                    <span className="delicious-item-price">€{item.price.toFixed(2)}</span>
                </div>

                <p className="delicious-item-desc">{item.description}</p>
            </div>
        </div>
    );
}
