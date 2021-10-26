import constants as keys
from telegram.ext import *
from responses import *

print('Bot started...')



def start_command(update, context) -> str:
    """Handles the /start command"""
    x = menu()
    update.message.reply_text(f'Hi there! 🖐\nPut in a command to get started...')
    update.message.reply_text(x)
    


def help_command(update, context) -> str:
    """Handles the /help command"""
    update.message.reply_text('Are you seeking for help?')


def handle_message(update, context):
    """Handles all other messages."""
    # Receives a message from the user
    text = str(update.message.text).lower()
    # Processes the message
    resp = responses(text)
    # Puts the response back to the user
    update.message.reply_text(resp)


def error(update, context):
    print(f'Update {update} caused the issue {context.error}')


def main():
    updater = Updater(keys.API_KEY, use_context=True)
    dp = updater.dispatcher

    # Command Handlers
    dp.add_handler(CommandHandler('start', start_command))
    dp.add_handler(CommandHandler('help', help_command))

    # Message handlers
    dp.add_handler(MessageHandler(Filters.text, handle_message))

    # Error Handler
    dp.add_error_handler(error)

    # Start the Bot
    updater.start_polling()
    updater.idle()


# Driver code
main()
