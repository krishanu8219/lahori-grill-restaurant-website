import Image from 'next/image';
import Link from 'next/link';

export default function OrderSection() {
    return (
        <section className="order-section" id="order">
            <div className="order-container">
                <div className="order-image">
                    <Image
                        src="/food-variety.png"
                        alt="Variety of delicious Pakistani dishes ready for delivery"
                        width={600}
                        height={500}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
                <div className="order-card">
                    <h2 className="order-title">
                        <span className="order-subtitle">ORDER</span>
                        <span className="order-brand">LAHORI GRILL</span>
                        <span className="order-subtitle">NOW!</span>
                    </h2>
                    <p className="order-tagline">Delivered fresh to your doorstep.</p>
                    <p className="order-description">
                        We deliver to your neighborhood and many more neighboring towns. Click below to start your order.
                    </p>
                    <Link href="/menu" className="btn-dark">ORDER NOW</Link>
                </div>
            </div>
        </section>
    );
}
