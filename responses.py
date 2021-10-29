# File that handles the commands and return the responses.

from datetime import datetime
import requests
import os

API_KEY = os.environ.get('TELEGRAM_BOT_TOKEN')
QUOTE_URL = 'https://api.quotable.io/random'
SO_URL = 'https://api.stackexchange.com/2.3/users/2773206?order=desc&sort=reputation&site=stackoverflow'
MENU_CHOICES: dict = {'0': 'Go back to Menu',
                      '1': 'Who are you?', '2': 'Random Quote', '3': 'Know Time', '4': 'StackOverflow'}
NUM_EMOJIS = {'1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣', '0': '0️⃣'}


def quote():
    """Returns a random quote."""
    r = requests.get('https://api.quotable.io/random')
    resp = r.json()
    q = f"{resp['content']} - {resp['author']}"
    return q


def menu():
    """Returns the command choices."""
    choices = ''
    for i, v in MENU_CHOICES.items():
        temp = f'\n{NUM_EMOJIS[i]} {v}\n'
        choices += temp

    choices = choices.strip()
    return choices


def get_SO_data() -> str:
    """Returns the StackOverflow reputation."""
    r = requests.get(SO_URL)
    x = r.json()
    rep = x['items'][0]['reputation']
    badges = x['items'][0]['badge_counts']
    gold, silver, bronze = badges.get('gold', 0), badges.get(
        'silver', 0), badges.get('bronze', 0)
    resp_text = f'Reputation: {rep}\n\n🥇 Gold: {gold}\n🥈 Silver: {silver}\n🥉 Bronze: {bronze}'
    return resp_text


def who():
    """Returns the name of the bot."""
    return 'I am a BOT! 🤖'


def get_time():
    """Returns the current time"""
    now = datetime.now()
    d = now.strftime('%d-%b-%y, %H:%M')
    return f'⏲ {d}'


FUNC_CHOICES: dict = {'0': menu, '1': who,
                      '2': quote, '3': get_time, '4': get_SO_data}


def responses(inp_text: str) -> str:
    user_message = str(inp_text)
    if user_message in FUNC_CHOICES:
        return FUNC_CHOICES[user_message]()
    return f'Incorrect choice. 🤷‍♂️\n{menu()}'
