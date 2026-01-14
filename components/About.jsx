import Image from 'next/image';
import Link from 'next/link';

export default function About() {
    return (
        <section className="about-section" id="about">
            <div className="about-container">
                <div className="about-card">
                    <div className="about-text">
                        <h2 className="about-title">
                            <span>AUTENTICI</span>
                            <span>PIATTI LAHORE</span>
                            <span>CON UN TOCCO</span>
                            <span>MODERNO</span>
                        </h2>
                        <p className="about-description">
                            Vi invitiamo a intraprendere un viaggio culinario che celebra il ricco arazzo dei
                            sapori di Lahore. Con un impegno per l'autenticità, prepariamo meticolosamente piatti
                            pakistani tradizionali utilizzando ricette tramandate nel tempo e i migliori ingredienti.
                        </p>
                        <Link href="/menu" className="btn-primary">VEDI IL NOSTRO MENU</Link>
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
