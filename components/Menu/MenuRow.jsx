'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function MenuRow({ leftItem, rightItem }) {
    const { state, dispatch } = useCart();

    const getCartQuantity = (item) => {
        if (!item) return 0;
        const cartItem = state.items.find(i => i.id === item.id);
        return cartItem ? cartItem.quantity : 0;
    };

    const handleAddToCart = (item) => {
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

    const handleIncrement = (itemId) => {
        dispatch({ type: 'INCREMENT_ITEM', payload: { id: itemId } });
    };

    const handleDecrement = (item) => {
        const quantity = getCartQuantity(item);
        if (quantity === 1) {
            dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
        } else {
            dispatch({ type: 'DECREMENT_ITEM', payload: { id: item.id } });
        }
    };

    const renderItemInfo = (item, position) => {
        if (!item) return <div className="menu-item-info empty"></div>;

        const quantity = getCartQuantity(item);

        return (
            <div className={`menu-item-info ${position}`}>
                <span className="menu-star">⭐</span>
                <div className="menu-item-content">
                    <h3 className="menu-item-title">{item.name}</h3>
                    <p className="menu-item-desc">{item.description}</p>
                    <div className="menu-item-bottom">
                        <span className="menu-item-price">€{item.price.toFixed(2)}</span>
                        {quantity === 0 ? (
                            <button onClick={() => handleAddToCart(item)} className="btn-add-small">
                                + Add
                            </button>
                        ) : (
                            <div className="quantity-controls-small">
                                <button onClick={() => handleDecrement(item)} className="qty-btn-small">−</button>
                                <span className="qty-display">{quantity}</span>
                                <button onClick={() => handleIncrement(item.id)} className="qty-btn-small">+</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="menu-row">
            {renderItemInfo(leftItem, 'left')}

            <div className="menu-dual-images">
                <div className="menu-image-wrapper">
                    <div className="orange-ribbon"></div>
                    <Image
                        src="/hero-food.png"
                        alt={leftItem?.name || 'Menu item'}
                        width={150}
                        height={130}
                        className="menu-img"
                        loading="lazy"
                        quality={75}
                    />
                </div>
                <div className="menu-image-wrapper">
                    <div className="orange-ribbon"></div>
                    <Image
                        src="/naan-tikka.png"
                        alt={rightItem?.name || 'Menu item'}
                        width={150}
                        height={130}
                        className="menu-img"
                        loading="lazy"
                        quality={75}
                    />
                </div>
            </div>

            {renderItemInfo(rightItem, 'right')}
        </div>
    );
}
