/**
 * Send Telegram notification to restaurant
 */
export async function sendTelegramNotification(order) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Missing Telegram environment variables');
    return false;
  }

  // Support multiple chat IDs (comma-separated)
  const chatIds = TELEGRAM_CHAT_ID.split(',').map(id => id.trim());

  // Format the order message
  const orderTypeText = order.order_type === 'delivery' ? '🚚 CONSEGNA' : '🏪 RITIRO';
  const paymentMethodText = order.payment_method === 'cash' ? '💵 Contanti' : 
                           order.payment_method === 'satispay' ? '📱 Satispay' : '💳 Carta/Bancomat';
  const itemsList = order.items
    .map((item) => `  • ${item.quantity}x ${item.name} - €${item.unit_price.toFixed(2)}`)
    .join('\n');

  let messageBody = `🍽️ <b>NUOVO ORDINE - Lahori Grill</b>\n\n`;
  messageBody += `<b>${orderTypeText}</b>\n\n`;
  messageBody += `👤 <b>Cliente:</b> ${order.customer_name}\n`;
  messageBody += `📞 <b>Telefono:</b> ${order.phone}\n`;
  messageBody += `${paymentMethodText}\n`;

  if (order.order_type === 'delivery' && order.address) {
    messageBody += `📍 <b>Indirizzo:</b> ${order.address}\n`;
  }

  if (order.location_description) {
    messageBody += `📝 <b>Note:</b> ${order.location_description}\n`;
  }

  messageBody += `\n<b>Articoli:</b>\n${itemsList}\n`;
  messageBody += `\n💰 <b>Totale: €${order.total_price.toFixed(2)}</b>`;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  // Send to all chat IDs
  const results = await Promise.all(
    chatIds.map(async (chatId) => {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageBody,
            parse_mode: 'HTML',
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Telegram API error for chat ${chatId}:`, errorData);
          return false;
        }

        const result = await response.json();
        console.log(`Telegram notification sent to ${chatId}:`, result);
        return true;
      } catch (error) {
        console.error(`Error sending Telegram notification to ${chatId}:`, error);
        return false;
      }
    })
  );

  // Return true if at least one message was sent successfully
  return results.some(result => result === true);
}
