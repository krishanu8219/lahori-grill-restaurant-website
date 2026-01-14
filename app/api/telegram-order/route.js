import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const orderData = await request.json();
        const { items, total, customer, delivery, payment } = orderData;

        // Validate environment variables
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        // For debugging (remove in production if sensitive)
        console.log('Sending Telegram message...', { botToken: botToken ? 'Sets' : 'Missing', chatId });

        if (!botToken || !chatId) {
            console.error('Telegram credentials missing');
            return NextResponse.json(
                { success: false, error: 'Server configuration error: Missing Telegram credentials' },
                { status: 500 }
            );
        }

        // Format message
        let message = `🆕 *NUOVO ORDINE ONLINE* 🆕\n\n`;
        message += `👤 *Cliente:* ${customer.name}\n`;
        message += `📞 *Telefono:* ${customer.phone}\n`;
        if (customer.email) message += `📧 *Email:* ${customer.email}\n`;

        message += `\n📦 *Dettagli Ordine:*\n`;
        items.forEach(item => {
            message += `- ${item.quantity}x ${item.name} (€${(item.price * item.quantity).toFixed(2)})\n`;
        });

        message += `\n🚚 *Tipo:* ${delivery.type === 'delivery' ? 'Consegna a Domicilio' : 'Ritiro'}\n`;
        if (delivery.type === 'delivery') {
            message += `📍 *Indirizzo:* ${delivery.address}\n`;
            if (delivery.instructions) message += `📝 *Note:* ${delivery.instructions}\n`;
            message += `🛵 *Costo Consegna:* €${delivery.fee.toFixed(2)}\n`;
        }

        message += `\n💰 *Pagamento:* ${payment.method === 'cash' ? 'Contanti' : payment.method === 'card' ? 'Carta/POS' : 'Satispay'}\n`;
        message += `💵 *TOTALE:* €${total.toFixed(2)}\n`;
        message += `\n📅 *Data:* ${new Date().toLocaleString('it-IT')}`;

        // Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        const result = await response.json();

        if (!result.ok) {
            console.error('Telegram API response error:', result);
            throw new Error(result.description || 'Telegram API Error');
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Telegram send error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
