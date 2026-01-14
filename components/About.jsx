import Image from 'next/image';
import Link from 'next/link';

export default function About() {
    return (
        <section className="about-section" id="about">
            <div className="about-container">
                <div className="about-card">
                    <div className="about-text">
                        <h2 className="about-title">
                            <span>AUTHENTIC</span>
                            <span>LAHORI DISHES</span>
                            <span>WITH A MODERN</span>
                            <span>TWIST</span>
                        </h2>
                        <p className="about-description">
                            We invite you to embark on a culinary journey that celebrates the rich tapestry of Lahori
                            flavors. With a commitment to authenticity, we meticulously craft traditional Pakistani dishes
                            using time-honored recipes and the finest ingredients.
                        </p>
                        <Link href="/menu" className="btn-primary">SEE OUR MENU</Link>
                    </div>
                    <div className="about-image">
                        <Image
                            src="/chef.png"
                            alt="Our expert chef presenting signature Lahori dishes"
                            width={600}
                            height={500}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
