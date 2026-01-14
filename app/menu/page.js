import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MenuPage from '@/components/Menu/MenuPage';

export const metadata = {
    title: 'Menu | Lahori Grill',
    description: 'Explore our authentic Pakistani menu with over 80 dishes including biryani, kebabs, curries, naan, and more.',
};

export default function Menu() {
    return (
        <>
            <Header />
            <main className="menu-page-wrapper">
                <MenuPage />
            </main>
            <Footer />
        </>
    );
}
