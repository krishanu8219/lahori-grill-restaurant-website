# Guida Configurazione Telegram Bot

Segui questi passaggi per abilitare le notifiche degli ordini.

## 1. Crea il Bot
1. Cerca **@BotFather** su Telegram.
2. Invia `/newbot`.
3. Scegli un nome e un username (deve finire con `bot`).
4. Copia il **TOKEN** (es. `123456:ABC-DEF`).

## 2. Ottieni Chat ID
### Per Chat Privata:
1. Avvia il tuo bot.
2. Scrivigli "Ciao".

### Per Gruppi:
1. Aggiungi il bot al gruppo.
2. Scrivi un messaggio nel gruppo.

### Estrai l'ID:
Visita: `https://api.telegram.org/bot<TOKEN>/getUpdates`
Cerca `"chat":{"id":123456789}`. Copia l'ID.

## 3. Configura il file .env.local
Crea un file `.env.local` nella cartella principale:

```env
TELEGRAM_BOT_TOKEN=tuo_token
TELEGRAM_CHAT_ID=tuo_chat_id
```

## 4. Riavvia
Riavvia il server (`npm run dev`) per applicare le modifiche.
