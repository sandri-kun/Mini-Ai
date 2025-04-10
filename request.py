import requests
import json

# Menyusun header
headers = {
    "Authorization": "Bearer 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",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://example.com",  # Harus pakai https:// lengkap
    "X-Title": "MiniDialog"
}

# Menyusun payload (isi permintaan)
payload = {
    "model": "deepseek/deepseek-r1:free",  # Model yang valid, bisa diganti misalnya: "openai/gpt-3.5-turbo"
    "messages": [
        {"role": "user", "content": "Kmau chatgpt versi berapa"}
    ]
}

# Melakukan permintaan POST
response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers=headers,
    data=json.dumps(payload)
)

# Menampilkan hasil respon
if response.status_code == 200:
    data = response.json()
    print("Response:")
    print(json.dumps(data, indent=2))  # Menampilkan hasil dengan rapi
else:
    print(f"Error {response.status_code}: {response.text}")
