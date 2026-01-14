import Image from 'next/image';
import Link from 'next/link';

export default function GiftCard() {
    return (
        <section className="giftcard-section">
            <div className="giftcard-container">
                <div className="giftcard-content">
                    <h2 className="giftcard-title">REGALA UN BUONO REGALO!</h2>
                    <p className="giftcard-subtitle">Regala il gusto. Perfetto per ogni occasione!</p>
                    <Link href="#" className="btn-dark">ACQUISTA ORA</Link>
                </div>
                <div className="giftcard-image">
                    <Image
                        src="/naan-tikka.png"
                        alt="Fresh naan and chicken tikka"
                        width={500}
                        height={400}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </div>
            </div>
        </section>
    );
}
