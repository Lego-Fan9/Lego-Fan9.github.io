import json
import re

def remove_newlines(text: str) -> str:
    return re.sub(r'\\n', '', text)

def remove_weird_bold(text: str) -> str:
    return re.sub(r'\\b', '', text)

def remove_unicode(text: str) -> str:
    return re.sub(r'\\u[0-9a-fA-F]{4}', '', text)

def remove_escaped_quotes(text: str) -> str:
    return re.sub(r'\\"', '', text)

def remove_backslash_k(text: str) -> str:
    text = re.sub(r'\\\\k', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\\k', '', text, flags=re.IGNORECASE)
    return text

def clean_text(text: str) -> str:
    if not isinstance(text, str):
        print("Skipping something")
        return ""
    for func in [remove_newlines, remove_unicode, remove_escaped_quotes, remove_backslash_k, remove_weird_bold]:
        text = func(text)
    return text

filepath = input("filepath: ")

with open(filepath, "r") as file:
    data = json.load(file)['data']

for key in list(data.keys()):
    if key in ["SPECIALABILITY_SLAVE1_01_DESC", "KEYBINDING_KEY_NAME_Backslash", "KEYBINDING_KEY_QWERTY_NAME_Backslash"]:
        continue

    text = clean_text(data[key])
    if '\\' in text:
        print(f"{key}: {repr(text)}")
        break
