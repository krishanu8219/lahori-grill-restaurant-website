import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
    {
        id: 1,
        name: 'Lahori Biryani',
        description: 'Aromatic basmati rice layered with tender spiced meat and saffron',
        image: '/hero-food.png',
    },
    {
        id: 2,
        name: 'Seekh Kebab',
        description: 'Succulent minced meat kebabs grilled to perfection in tandoor',
        image: '/naan-tikka.png',
    },
    {
        id: 3,
        name: 'Butter Chicken',
        description: 'Tender chicken in rich, creamy tomato-based curry sauce',
        image: '/food-variety.png',
    },
];

export default function MenuPreview() {
    return (
        <section className="menu-preview" id="menu">
            <div className="menu-preview-container">
                <h2 className="section-title">OUR SIGNATURE DISHES</h2>
                <div className="menu-grid">
                    {menuItems.map((item) => (
                        <div key={item.id} className="menu-card">
                            <div className="menu-card-image">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={400}
                                    height={300}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="menu-card-content">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="#" className="btn-primary btn-center">VIEW FULL MENU</Link>
            </div>
        </section>
    );
}
