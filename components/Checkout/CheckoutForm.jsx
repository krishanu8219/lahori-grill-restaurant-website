'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart, calculateTotal } from '@/context/CartContext';
import StepIndicator from './StepIndicator';
import Image from 'next/image';

export default function CheckoutForm() {
    const { state, dispatch } = useCart();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [isCalculatingFee, setIsCalculatingFee] = useState(false);
    const [distance, setDistance] = useState(null);

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
        { title: 'Cart', description: 'Review items' },
        { title: 'Contact', description: 'Your details' },
        { title: 'Delivery', description: 'Order type' },
        { title: 'Payment', description: 'Payment method' },
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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
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
                setError('Please fill in all required fields');
                return false;
            }
        }
        if (currentStep === 3 && formData.order_type === 'delivery' && !formData.address) {
            setError('Please provide a delivery address');
            return false;
        }
        setError('');
        return true;
    };

    const handleNext = () => {
        if (validateStep()) {
            nextStep();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        if (!formData.customer_name || !formData.phone) {
            setError('Please provide your name and phone number');
            setCurrentStep(2);
            return;
        }

        if (formData.order_type === 'delivery' && !formData.address) {
            setError('Please provide a delivery address');
            setCurrentStep(3);
            return;
        }

        setIsSubmitting(true);
        setError('');

        const subtotal = calculateTotal(state.items);
        const finalDeliveryFee = formData.order_type === 'delivery' ? deliveryFee : 0;
        const total = subtotal + finalDeliveryFee;

        const orderPayload = {
            customer_name: formData.customer_name,
            phone: formData.phone,
            email: formData.email,
            order_type: formData.order_type,
            payment_method: formData.payment_method,
            address: formData.address,
            location_description: formData.location_description,
            items: state.items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                unit_price: item.price,
                image: item.image,
            })),
            subtotal: subtotal,
            delivery_fee: finalDeliveryFee,
            delivery_distance: distance,
            total_price: total,
        };

        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to place order');
            }

            // Clear cart and redirect to confirmation
            dispatch({ type: 'CLEAR_CART' });
            const orderData = encodeURIComponent(JSON.stringify(data.order));
            router.push(`/order-confirmation?data=${orderData}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to place order');
        } finally {
            setIsSubmitting(false);
        }
    };

    const total = calculateTotal(state.items);

    // Step 1: Cart Review
    const renderCartReview = () => (
        <div className="checkout-step step-cart-review">
            <h2 className="step-heading">Review Your Order</h2>
            <div className="cart-items-list">
                {state.items.map((item) => (
                    <div key={item.id} className="cart-review-item">
                        <div className="cart-item-image">
                            <Image
                                src={item.image || '/hero-food.png'}
                                alt={item.name}
                                width={80}
                                height={80}
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <div className="cart-item-details">
                            <h3>{item.name}</h3>
                            <p className="cart-item-quantity">Qty: {item.quantity}</p>
                        </div>
                        <div className="cart-item-price">
                            €{(item.price * item.quantity).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-total-summary">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>€{total.toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                    <span>Total</span>
                    <span>€{total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );

    // Step 2: Contact Information
    const renderContactInfo = () => (
        <div className="checkout-step step-contact">
            <h2 className="step-heading">Contact Information</h2>
            <div className="form-fields">
                <div className="form-field">
                    <label htmlFor="customer_name">Full Name *</label>
                    <input
                        type="text"
                        id="customer_name"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        className="premium-input"
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="phone">Phone Number *</label>
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
                    <label htmlFor="email">Email (Optional)</label>
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
            <h2 className="step-heading">How would you like to receive your order?</h2>

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
                        <h3>Pickup</h3>
                        <p>Collect from our restaurant</p>
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
                        <h3>Delivery</h3>
                        <p>We'll deliver to your door</p>
                    </div>
                    <div className="selection-indicator"></div>
                </label>
            </div>

            {formData.order_type === 'delivery' && (
                <div className="delivery-address-section">
                    <div className="form-field">
                        <label htmlFor="address">Delivery Address *</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required={formData.order_type === 'delivery'}
                            placeholder="Street, number, postal code, city"
                            className="premium-input"
                        />
                        {isCalculatingFee && (
                            <p className="delivery-fee-info" style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
                                🔄 Calculating delivery fee...
                            </p>
                        )}
                        {!isCalculatingFee && distance && (
                            <p className="delivery-fee-info" style={{ color: '#4CAF50', fontSize: '14px', marginTop: '8px' }}>
                                📍 Distance: {distance}km • Delivery fee: €{deliveryFee.toFixed(2)}
                                {parseFloat(distance) <= 1.5 && ' (Free delivery!)'}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="form-field">
                <label htmlFor="location_description">Special Instructions (Optional)</label>
                <textarea
                    id="location_description"
                    name="location_description"
                    value={formData.location_description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Add any special instructions for your order..."
                    className="premium-textarea"
                />
            </div>
        </div>
    );

    // Step 4: Payment Method
    const renderPaymentMethod = () => (
        <div className="checkout-step step-payment">
            <h2 className="step-heading">Choose Payment Method</h2>

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

            <div className="order-summary-final">
                <h3>Order Summary</h3>
                <div className="summary-details">
                    <div className="summary-row">
                        <span>Items ({state.items.length})</span>
                        <span>€{total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>
                            {formData.order_type === 'delivery'
                                ? (isCalculatingFee ? '...' : `€${deliveryFee.toFixed(2)}`)
                                : '€0.00'}
                        </span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>€{(total + (formData.order_type === 'delivery' ? deliveryFee : 0)).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="premium-checkout-form">
            <StepIndicator currentStep={currentStep} steps={steps} />

            <form onSubmit={handleSubmit} className="checkout-steps-container">
                <div className="step-content">
                    {currentStep === 1 && renderCartReview()}
                    {currentStep === 2 && renderContactInfo()}
                    {currentStep === 3 && renderDeliveryOptions()}
                    {currentStep === 4 && renderPaymentMethod()}
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
                            Previous
                        </button>
                    )}

                    {currentStep < steps.length ? (
                        <button
                            type="button"
                            onClick={handleNext}
                            className="btn-checkout-nav btn-next"
                        >
                            Continue
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn-checkout-nav btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Place Order
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

