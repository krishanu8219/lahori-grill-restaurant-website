'use client';

import { useState } from 'react';
import { categories, getItemsByCategory } from '@/lib/menuData';
import MenuItem from './MenuItem';

export default function MenuPage() {
    const [activeCategory, setActiveCategory] = useState(categories[0].id);

    const items = getItemsByCategory(activeCategory);

    // Group items into pairs for 2-column layout
    const itemPairs = [];
    for (let i = 0; i < items.length; i += 2) {
        itemPairs.push({
            left: items[i],
            right: items[i + 1] || null,
        });
    }

    return (
        <div className="delicious-menu-page">
            {/* Header */}
            <div className="delicious-menu-header">
                <div className="special-selection-badge">SPECIAL SELECTION</div>

                {/* Decorative Divider */}
                <div className="menu-decorative-divider">
                    <span className="divider-line"></span>
                    <svg className="divider-diamond" width="60" height="20" viewBox="0 0 60 20" fill="none">
                        <path d="M15 10L20 5L25 10L20 15L15 10Z" stroke="currentColor" strokeWidth="1" />
                        <path d="M30 10L35 5L40 10L35 15L30 10Z" stroke="currentColor" strokeWidth="1" />
                        <path d="M45 10L50 5L55 10L50 15L45 10Z" stroke="currentColor" strokeWidth="1" />
                    </svg>
                    <span className="divider-line"></span>
                </div>

                <h1 className="delicious-menu-title">Delicious Menu</h1>
            </div>

            {/* Category Tabs - Pill Shaped */}
            <nav className="menu-category-nav">
                <div className="menu-category-tabs-pills">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`category-pill ${activeCategory === category.id ? 'active' : ''}`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </nav>

            {/* Menu Items - 2 Column Grid */}
            <div className="delicious-menu-grid">
                {itemPairs.map((pair, index) => (
                    <div key={index} className="menu-grid-row">
                        {pair.left && (
                            <MenuItem item={pair.left} />
                        )}
                        {pair.right && (
                            <MenuItem item={pair.right} />
                        )}
                    </div>
                ))}
            </div>

            {/* Footer Hours */}
            <div className="menu-footer-hours">
                Tutti i giorni: <span>12:00 - 15:00</span> e <span>18:00 - 23:00</span>
            </div>
        </div>
    );
}
