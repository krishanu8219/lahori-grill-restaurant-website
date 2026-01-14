import { NextResponse } from 'next/server';
import { sendTelegramNotification } from '@/lib/telegram';
import { getDeliveryFeeFromAddress } from '@/lib/distance';

export async function POST(request) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.customer_name || typeof body.customer_name !== 'string' || body.customer_name.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Customer name is required' },
                { status: 400 }
            );
        }

        if (!body.phone || typeof body.phone !== 'string' || body.phone.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Phone number is required' },
                { status: 400 }
            );
        }

        if (!body.order_type || !['pickup', 'delivery'].includes(body.order_type)) {
            return NextResponse.json(
                { success: false, error: 'Order type must be either "pickup" or "delivery"' },
                { status: 400 }
            );
        }

        // Validate delivery address if order type is delivery
        if (body.order_type === 'delivery') {
            if (!body.address || typeof body.address !== 'string' || body.address.trim() === '') {
                return NextResponse.json(
                    { success: false, error: 'Address is required for delivery orders' },
                    { status: 400 }
                );
            }
        }

        // Validate items
        if (!Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Order must contain at least one item' },
                { status: 400 }
            );
        }

        // Validate each item
        for (const item of body.items) {
            if (!item.id || !item.name || !item.quantity || !item.unit_price) {
                return NextResponse.json(
                    { success: false, error: 'Each item must have id, name, quantity, and unit_price' },
                    { status: 400 }
                );
            }

            if (typeof item.quantity !== 'number' || item.quantity <= 0) {
                return NextResponse.json(
                    { success: false, error: 'Item quantity must be a positive number' },
                    { status: 400 }
                );
            }

            if (typeof item.unit_price !== 'number' || item.unit_price <= 0) {
                return NextResponse.json(
                    { success: false, error: 'Item price must be a positive number' },
                    { status: 400 }
                );
            }
        }

        // Validate total price
        const subtotal = body.subtotal || 0;
        let deliveryFee = body.delivery_fee || 0;
        
        // Validate delivery fee for delivery orders
        if (body.order_type === 'delivery' && body.address) {
            try {
                const deliveryCalculation = await getDeliveryFeeFromAddress(body.address);
                const expectedDeliveryFee = deliveryCalculation.fee;
                
                // Allow a small tolerance for rounding
                if (Math.abs(deliveryFee - expectedDeliveryFee) > 0.01) {
                    console.warn(`Delivery fee mismatch: expected ${expectedDeliveryFee}, got ${deliveryFee}`);
                    // Use the calculated fee to prevent fraud
                    deliveryFee = expectedDeliveryFee;
                }
            } catch (error) {
                console.error('Error validating delivery fee:', error);
                // If validation fails, use a default fee of €1
                deliveryFee = 1.00;
            }
        }
        
        const expectedTotal = subtotal + deliveryFee;
        
        if (typeof body.total_price !== 'number' || body.total_price <= 0) {
            return NextResponse.json(
                { success: false, error: 'Total price must be a positive number' },
                { status: 400 }
            );
        }
        
        // Verify calculation is correct (allow small tolerance for recalculated fee)
        if (Math.abs(body.total_price - expectedTotal) > 0.5) {
            return NextResponse.json(
                { success: false, error: 'Total price calculation mismatch' },
                { status: 400 }
            );
        }

        // Generate a temporary ID for the order (timestamp + random)
        const orderId = `LG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

        // Construct order object
        const order = {
            id: orderId,
            customer_name: body.customer_name.trim(),
            phone: body.phone.trim(),
            email: body.email?.trim() || '',
            order_type: body.order_type,
            payment_method: body.payment_method || 'cash',
            address: body.address?.trim() || '',
            location_description: body.location_description?.trim() || '',
            items: body.items,
            subtotal: subtotal,
            delivery_fee: deliveryFee,
            delivery_distance: body.delivery_distance || null,
            total_price: subtotal + deliveryFee,
            created_at: new Date().toISOString(),
            status: 'pending'
        };

        // Send Telegram notification
        const telegramSent = await sendTelegramNotification(order);

        if (!telegramSent) {
            console.warn('Telegram notification failed to send');
        }

        return NextResponse.json(
            {
                success: true,
                orderId: orderId,
                order: order,
                message: 'Order placed successfully',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error processing order:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to process order',
            },
            { status: 500 }
        );
    }
}
