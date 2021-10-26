# File that handles the commands and return the responses.

from datetime import datetime
import requests
import constants as keys


def quote():
    """Returns a random quote."""
    r = requests.get('https://api.quotable.io/random')
    resp = r.json()
    q = f"{resp['content']} - {resp['author']}"
    return q


def menu():
    """Shows the Menu."""
    choices = ''
    for i, v in keys.CHOICES.items():
        temp = f'{i}. {v[0]}\n'
        choices += temp

    choices = choices.strip()
    return choices


def who():
    return 'I am a BOT! 🤖'

def get_time():
    now = datetime.now()
    d = now.strftime('%d-%b-%y, %H:%M')
    return f'⏲ {d}'


def responses(inp_text: str) -> str:
    """Driver code for all the responses."""
    user_message = str(inp_text)
    if user_message in keys.CHOICES:
        if user_message == '1':
            return who()
        elif user_message == '0':
            return menu()
        elif user_message == '2':
            return quote()
        elif user_message == '3':
            return get_time()

    return 'Incorrect choice. 🤷‍♂️'
