export default function Marquee() {
    const items = [
        'APPETIZERS', 'ENTREES', 'BREADS', 'BIRYANIS', 'KEBABS', 'DESSERTS'
    ];

    return (
        <section className="marquee-section">
            <div className="marquee-track">
                <div className="marquee-content">
                    {[...items, ...items].map((item, index) => (
                        <span key={index}>
                            <span className="marquee-item">{item}</span>
                            <span className="marquee-icon">❈</span>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}
