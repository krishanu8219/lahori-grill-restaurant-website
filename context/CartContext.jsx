'use client';

import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// Initial state
const initialState = {
    items: [],
};

// Create context
const CartContext = createContext(undefined);

// Cart reducer
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);

            if (existingItem) {
                return {
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }

            return {
                items: [...state.items, { ...action.payload, quantity: 1 }],
            };
        }

        case 'REMOVE_ITEM': {
            return {
                items: state.items.filter(item => item.id !== action.payload.id),
            };
        }

        case 'INCREMENT_ITEM': {
            return {
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            };
        }

        case 'DECREMENT_ITEM': {
            return {
                items: state.items.map(item =>
                    item.id === action.payload.id && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                ).filter(item => item.quantity > 0),
            };
        }

        case 'CLEAR_CART': {
            return initialState;
        }

        default:
            return state;
    }
};

// Cart Provider component
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage after hydration
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('lahori-grill-cart');
            if (savedCart) {
                try {
                    const parsed = JSON.parse(savedCart);
                    // Restore cart items
                    parsed.items.forEach(item => {
                        dispatch({ type: 'ADD_ITEM', payload: item });
                        // Set correct quantity
                        for (let i = 1; i < item.quantity; i++) {
                            dispatch({ type: 'INCREMENT_ITEM', payload: { id: item.id } });
                        }
                    });
                } catch (error) {
                    console.error('Error loading cart from localStorage:', error);
                }
            }
            setIsHydrated(true);
        }
    }, []);

    // Save cart to localStorage whenever it changes (only after hydration)
    useEffect(() => {
        if (isHydrated && typeof window !== 'undefined') {
            localStorage.setItem('lahori-grill-cart', JSON.stringify(state));
        }
    }, [state, isHydrated]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use cart
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

// Helper function to calculate total
export const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

// Helper function to get total items count
export const getTotalItems = (items) => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
};
