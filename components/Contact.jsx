export default function Contact() {
    return (
        <section className="contact-section" id="contact">
            <div className="contact-container">
                <div className="contact-info">
                    <h2 className="section-title">DOVE SIAMO</h2>
                    <div className="contact-details">
                        <div className="contact-item">
                            <span className="contact-icon">📍</span>
                            <div>
                                <h4>Posizione</h4>
                                <p>Corso Brescia, 22/A<br />10152 Torino, Italy</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">📞</span>
                            <div>
                                <h4>Telefono</h4>
                                <p>Solo Ordini Online</p>
                            </div>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">🕐</span>
                            <div>
                                <h4>Orari</h4>
                                <p>Lun-Mer, Dom: 11:00 - 15:00, 18:00 - 23:00<br />Gio: Chiuso</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-map">
                    <a
                        href="https://www.google.com/maps/place/Lahori+Grill/@45.0896,7.6614,17z"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2818.5!2d7.6614!3d45.0896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47886d7f1c1e1111%3A0x1234567890abcdef!2sCorso%20Brescia%2C%2022%2FA%2C%2010152%20Torino%20TO%2C%20Italy!5e0!3m2!1sen!2sit!4v1234567890"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lahori Grill Location"
                        ></iframe>
                    </a>
                </div>
            </div>
        </section>
    );
}
