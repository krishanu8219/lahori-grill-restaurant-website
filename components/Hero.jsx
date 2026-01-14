import Image from 'next/image';

export default function Hero() {
    return (
        <section className="hero" id="home">
            <div className="hero-content">
                <div className="hero-text">
                    <div className="mandala-ornament"></div>
                    <h1 className="hero-title">
                        <span className="title-line">AUTHENTIC</span>
                        <span className="title-line title-large">LAHORI</span>
                        <span className="title-line title-large">CUISINE</span>
                    </h1>
                    <p className="hero-description">
                        Lahori Grill brings the taste of Pakistan with a twist, freshly made with spices & love!
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
