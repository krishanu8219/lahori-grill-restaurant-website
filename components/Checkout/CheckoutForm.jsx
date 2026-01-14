'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, calculateTotal } from '@/context/CartContext';
import StepIndicator from './StepIndicator';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamic import for map component (SSR disabled)
const LocationPicker = dynamic(() => import('./LocationPicker'), { ssr: false });

export default function CheckoutForm() {
    const { state, dispatch } = useCart();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [isCalculatingFee, setIsCalculatingFee] = useState(false);
    const [distance, setDistance] = useState(null);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        email: '',
        order_type: 'pickup',
        payment_method: 'cash',
        address: '',
        location_description: '',
    });

    const steps = [
        { title: 'Carrello', description: 'Rivedi articoli' },
        { title: 'Contatti', description: 'I tuoi dati' },
        { title: 'Ordine', description: 'Consegna e pagamento' },
    ];

    // Calculate delivery fee when address changes
    useEffect(() => {
        const calculateFee = async () => {
            if (formData.order_type === 'delivery' && formData.address && formData.address.trim().length > 5) {
                setIsCalculatingFee(true);
                try {
                    const response = await fetch('/api/calculate-delivery', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ address: formData.address }),
                    });

                    const data = await response.json();

                    if (data.success) {
                        setDeliveryFee(data.deliveryFee);
                        setDistance(data.distance);
                    } else {
                        setDeliveryFee(1.00); // Default fee on error
                        setDistance(null);
                    }
                } catch (error) {
                    console.error('Error calculating delivery fee:', error);
                    setDeliveryFee(1.00); // Default fee on error
                    setDistance(null);
                } finally {
                    setIsCalculatingFee(false);
                }
            } else if (formData.order_type === 'pickup') {
                setDeliveryFee(0);
                setDistance(null);
            }
        };

        const timeoutId = setTimeout(calculateFee, 800); // Debounce
        return () => clearTimeout(timeoutId);
    }, [formData.address, formData.order_type]);

    // Fetch address suggestions as user types
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (formData.address.length < 3) {
                setAddressSuggestions([]);
                setShowSuggestions(false);
                return;
            }

            setIsLoadingSuggestions(true);
            try {
                // Search with Torino bias for better local results
                const query = encodeURIComponent(formData.address + ', Torino, Italia');
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5&addressdetails=1`,
                    {
                        headers: {
                            'User-Agent': 'LahoriGrill/1.0'
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    const suggestions = data.map(item => ({
                        display: item.display_name,
                        short: formatShortAddress(item),
                    }));
                    setAddressSuggestions(suggestions);
                    setShowSuggestions(suggestions.length > 0);
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            } finally {
                setIsLoadingSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce 300ms
        return () => clearTimeout(timeoutId);
    }, [formData.address]);

    // Helper to format short address from Nominatim result
    const formatShortAddress = (item) => {
        const addr = item.address || {};
        const parts = [];
        if (addr.road) {
            parts.push(addr.road + (addr.house_number ? ', ' + addr.house_number : ''));
        }
        if (addr.postcode) parts.push(addr.postcode);
        if (addr.city || addr.town || addr.village) {
            parts.push(addr.city || addr.town || addr.village);
        }
        return parts.join(', ') || item.display_name.split(',').slice(0, 3).join(',');
    };

    const handleSelectSuggestion = (suggestion) => {
        setFormData({
            ...formData,
            address: suggestion.short,
        });
        setShowSuggestions(false);
        setAddressSuggestions([]);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleMapLocationSelect = (address) => {
        setFormData({
            ...formData,
            address: address,
        });
        setShowSuggestions(false);
        setAddressSuggestions([]);
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const validateStep = () => {
        if (currentStep === 2) {
            if (!formData.customer_name || !formData.phone) {
                setError('Si prega di compilare tutti i campi obbligatori');
                return false;
            }
        }
        if (currentStep === 3) {
            if (formData.order_type === 'delivery' && !formData.address) {
                setError('Si prega di fornire un indirizzo di consegna');
                return false;
            }
            // Payment method is always selected by default (cash), so no extra check needed
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (isTransitioning) return;

        if (validateStep()) {
            setIsTransitioning(true);
            nextStep();
            // Short delay to prevent accidental double-clicks from triggering the next button
            setTimeout(() => {
                setIsTransitioning(false);
            }, 500);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If not on the last step, treating enter/submit as "Next"
        if (currentStep < steps.length) {
            handleNext();
            return;
        }

        if (isTransitioning) return;

        // Final validation
        if (!formData.customer_name || !formData.phone) {
            setError('Si prega di fornire nome e numero di telefono');
            setCurrentStep(2);
            return;
        }

        if (formData.order_type === 'delivery' && !formData.address) {
            setError('Si prega di fornire un indirizzo di consegna');
            setCurrentStep(3);
            return;
        }

        setIsSubmitting(true);
        setError('');

        const subtotal = calculateTotal(state.items);
        const finalDeliveryFee = formData.order_type === 'delivery' ? deliveryFee : 0;
        const total = subtotal + finalDeliveryFee;

        // Prepare data for Telegram API
        const orderPayload = {
            customer: {
                name: formData.customer_name,
                phone: formData.phone,
                email: formData.email || ''
            },
            items: state.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            })),
            delivery: {
                type: formData.order_type,
                address: formData.order_type === 'delivery' ? formData.address : 'N/A',
                fee: finalDeliveryFee,
                instructions: formData.location_description || ''
            },
            payment: {
                method: formData.payment_method
            },
            total: total
        };

        try {
            const response = await fetch('/api/telegram-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();

            if (!response.ok) {
                // Check if it's a known configuration error
                if (response.status === 500 && data.error && data.error.includes('Missing Telegram credentials')) {
                    throw new Error('Configurazione Server Incompleta: Credenziali Telegram mancanti. Contattare il ristorante.');
                }
                throw new Error(data.error || 'Si è verificato un errore durante l\'invio dell\'ordine.');
            }

            // Clear cart and redirect to confirmation
            dispatch({ type: 'CLEAR_CART' });

            // Pass data formatted for confirmation page
            const confirmationData = {
                id: Date.now().toString().slice(-6),
                customer_name: formData.customer_name,
                phone: formData.phone,
                order_type: formData.order_type,
                address: formData.order_type === 'delivery' ? formData.address : null,
                payment_method: formData.payment_method,
                items: state.items.map(item => ({
                    quantity: item.quantity,
                    name: item.name,
                    unit_price: item.price
                })),
                total_price: total
            };
            const orderData = encodeURIComponent(JSON.stringify(confirmationData));
            router.push(`/order-confirmation?data=${orderData}`);
        } catch (err) {
            console.error('Order submission error:', err);
            setError(err instanceof Error ? err.message : 'Si è verificato un errore imprevisto.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const total = calculateTotal(state.items);

    // Step 1: Cart Review
    const renderCartReview = () => (
        <div className="checkout-step step-cart-review">
            <h2 className="step-heading">Riepilogo Ordine</h2>
            <div className="cart-items-list">
                {state.items.map((item) => (
                    <div key={item.id} className="cart-review-item">
                        <div className="cart-item-image">
                            <Image
                                src={item.image || '/hero-food.png'}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="cart-food-img"
                            />
                        </div>
                        <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p className="cart-item-quantity">Qtà: {item.quantity}</p>
                        </div>
                        <div className="cart-item-price">
                            €{(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-total-summary">
                <div className="summary-row">
                    <span>Subtotale</span>
                    <span>€{total.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                    <span>Totale</span>
                    <span>€{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );

    // Step 2: Contact Information
    const renderContactInfo = () => (
        <div className="checkout-step step-contact">
            <h2 className="step-heading">Informazioni di Contatto</h2>
            <div className="form-fields">
                <div className="form-field">
                    <label htmlFor="customer_name">Nome Completo *</label>
                    <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                        placeholder="Inserisci il tuo nome completo"
                        className="premium-input"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="phone">Numero di Telefono *</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+39 123 456 7890"
                        className="premium-input"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email (Opzionale)</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="premium-input"
                    />
                </div>
            </div>
        </div>
    );

    // Step 3: Delivery/Pickup
    const renderDeliveryOptions = () => (
        <div className="checkout-step step-delivery">
            <h2 className="step-heading">Come desideri ricevere il tuo ordine?</h2>

            <div className="delivery-options">
                <label className={`delivery-card ${formData.order_type === 'pickup' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="order_type"
                        value="pickup"
                        checked={formData.order_type === 'pickup'}
                        onChange={handleChange}
                    />
                    <div className="delivery-card-content">
                        <div className="delivery-icon">🏪</div>
                        <h3>Ritiro</h3>
                        <p>Ritira dal nostro ristorante</p>
                    </div>
                    <div className="selection-indicator"></div>
                </label>

                <label className={`delivery-card ${formData.order_type === 'delivery' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="order_type"
                        value="delivery"
                        checked={formData.order_type === 'delivery'}
                        onChange={handleChange}
                    />
                    <div className="delivery-card-content">
                        <div className="delivery-icon">🚚</div>
                        <h3>Consegna</h3>
                        <p>Consegniamo a domicilio</p>
                    </div>
                    <div className="selection-indicator"></div>
                </label>
            </div>

            {formData.order_type === 'delivery' && (
                <div className="delivery-address-section">
                    <div className="form-field">
                        <label htmlFor="address">Indirizzo di Consegna *</label>

                        {/* Input wrapper for proper dropdown positioning */}
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                required={formData.order_type === 'delivery'}
                                placeholder="Via, numero, CAP, città"
                                className="premium-input"
                                autoComplete="off"
                            />

                            {/* Address Suggestions Dropdown - directly after input */}
                            {showSuggestions && addressSuggestions.length > 0 && (
                                <div className="address-suggestions-dropdown">
                                    {addressSuggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                            className="suggestion-item"
                                        >
                                            📍 {suggestion.short}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {isLoadingSuggestions && (
                            <p className="loading-text">🔍 Ricerca indirizzi...</p>
                        )}

                        {isCalculatingFee && (
                            <p className="delivery-fee-info calculating">
                                🔄 Calcolo costo di consegna...
                            </p>
                        )}
                        {!isCalculatingFee && distance && (
                            <p className="delivery-fee-info success">
                                📍 Distanza: {distance}km • Costo consegna: €{deliveryFee.toFixed(2)}
                                {parseFloat(distance) <= 1.5 && ' (Consegna gratuita!)'}
                            </p>
                        )}

                        {/* Map for pin-drop location selection */}
                        <LocationPicker onLocationSelect={handleMapLocationSelect} />
                    </div>
                </div>
            )}

            <div className="form-field">
                <label htmlFor="location_description">Istruzioni Speciali (Opzionale)</label>
                <textarea
                    id="location_description"
                    name="location_description"
                    value={formData.location_description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Aggiungi istruzioni speciali per il tuo ordine..."
                    className="premium-textarea"
                />
            </div>

            <h2 className="step-heading" style={{ marginTop: '3rem' }}>Metodo di Pagamento</h2>

            <div className="payment-methods">
                <label className={`payment-card ${formData.payment_method === 'cash' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="payment_method"
                        value="cash"
                        checked={formData.payment_method === 'cash'}
                        onChange={handleChange}
                    />
                    <div className="payment-card-content">
                        <div className="payment-icon">💵</div>
                        <h3>Contanti</h3>
                        <p>Pagamento in contanti alla {formData.order_type === 'delivery' ? 'consegna' : 'ritirata'}</p>
                    </div>
                    <div className="selection-indicator"></div>
                </label>

                <label className={`payment-card ${formData.payment_method === 'card' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="payment_method"
                        value="card"
                        checked={formData.payment_method === 'card'}
                        onChange={handleChange}
                    />
                    <div className="payment-card-content">
                        <div className="payment-icon">💳</div>
                        <h3>Carta/POS</h3>
                        <p>Pagamento con carta alla {formData.order_type === 'delivery' ? 'consegna' : 'ritirata'}</p>
                    </div>
                    <div className="selection-indicator"></div>
                </label>

                <label className={`payment-card ${formData.payment_method === 'satispay' ? 'selected' : ''}`}>
                    <input
                        type="radio"
                        name="payment_method"
                        value="satispay"
                        checked={formData.payment_method === 'satispay'}
                        onChange={handleChange}
                    />
                    <div className="payment-card-content">
                        <div className="payment-icon">📱</div>
                        <h3>Satispay</h3>
                        <p>Pagamento con Satispay alla {formData.order_type === 'delivery' ? 'consegna' : 'ritirata'}</p>
                    </div>
                    <div className="selection-indicator"></div>
                </label>
            </div>
        </div>
    );



    return (
        <div className="premium-checkout-form">
            <StepIndicator currentStep={currentStep} steps={steps} />

            <form
                onSubmit={handleSubmit}
                className="checkout-steps-container"
                onKeyDown={(e) => {
                    // Prevent form submission on Enter key unless on final step
                    if (e.key === 'Enter' && currentStep < steps.length) {
                        e.preventDefault();
                        handleNext();
                    }
                }}
            >
                <div className="step-content">
                    {currentStep === 1 && renderCartReview()}
                    {currentStep === 2 && renderContactInfo()}
                    {currentStep === 3 && renderDeliveryOptions()}
                </div>

                {error && (
                    <div className="checkout-error-message">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
                        </svg>
                        {error}
                    </div>
                )}

                <div className="checkout-navigation">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn-checkout-nav btn-previous"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Indietro
                        </button>
                    )}

                    {currentStep < steps.length ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="btn-checkout-nav btn-next"
                            disabled={isTransitioning}
                        >
                            Continua
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn-checkout-nav btn-submit"
                            disabled={isSubmitting || isTransitioning}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Elaborazione...
                                </>
                            ) : (
                                <>
                                    Invia Ordine
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M16.667 7.5L8.33366 15.8333L3.33366 10.8333" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </>
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}

