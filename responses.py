# File that handles the commands and return the responses.

from datetime import datetime
import requests

global CHOICES


def quote():
    """Returns a random quote."""
    r = requests.get('https://api.quotable.io/random')
    resp = r.json()
    q = f"{resp['content']} - {resp['author']}"
    return q


def menu():
    """Shows the Menu."""
    choices = ''
    for i, v in CHOICES.items():
        temp = f'{i}. {v[0]}\n'
        choices += temp

    choices = choices.strip()
    return choices


def who():
    return 'I am a BOT!'


def responses(inp_text: str) -> str:
    """Driver code for all the responses."""
    user_message = str(inp_text)
    if user_message in CHOICES:
        return CHOICES[user_message][1]

    return 'Incorrect choice.'


CHOICES: dict = {'0': ['Go back to Menu', menu()], '1': [
                                                   'Who are you?', who()], '2': ['Random Quote', quote()]}
