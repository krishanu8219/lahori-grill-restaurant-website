import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata = {
  title: 'Lahori Grill | Authentic Pakistani Cuisine',
  description: 'Lahori Grill - Authentic Pakistani & Lahori Cuisine. Experience the rich flavors of traditional Lahori dishes made with love and the finest spices.',
  keywords: ['Pakistani food', 'Lahori cuisine', 'biryani', 'kebabs', 'halal restaurant'],
  openGraph: {
    title: 'Lahori Grill | Authentic Pakistani Cuisine',
    description: 'Experience the rich flavors of traditional Lahori dishes made with love and the finest spices.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${playfair.variable}`}>
      <body suppressHydrationWarning>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
