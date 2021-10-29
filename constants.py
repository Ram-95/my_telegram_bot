# File to store constants used across the bot
import os

API_KEY = os.environ.get('TELEGRAM_BOT_TOKEN')
QUOTE_URL = 'https://api.quotable.io/random'

CHOICES: dict = {'0': ['Go back to Menu'], '1': ['Who are you?'], '2': ['Random Quote'], '3': ['Know Time']}

d = {'1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '0': '0️⃣'}
