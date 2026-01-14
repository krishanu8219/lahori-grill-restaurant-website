import Image from 'next/image';

export default function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <div className="hero-text">
                    <div style={{ width: '120px', marginBottom: '1.5rem' }}>
                        <Image
                            src="/halal-badge.png"
                            alt="100% Halal"
                            width={120}
                            height={120}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                    <h1 className="hero-title">
                        <span className="title-line">AUTENTICA</span>
                        <span className="title-line title-large">CUCINA</span>
                        <span className="title-line title-large">LAHORESE</span>
                    </h1>
                    <p className="hero-description">
                        Lahori Grill porta il gusto del Pakistan con un tocco speciale, preparato fresco con spezie e amore!
                    </p>
                </div>
                <div className="hero-image">
                    <Image
                        src="/hero-food.png"
                        alt="Authentic Lahori cuisine spread featuring biryani, kebabs, curries and naan"
                        width={800}
                        height={600}
                        priority
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>
        </section>
    );
}
