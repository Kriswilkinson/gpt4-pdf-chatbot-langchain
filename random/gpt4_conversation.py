import openai
import speech_recognition as sr
import pyaudio
import pyaudio

audio = pyaudio.PyAudio()

for i in range(audio.get_device_count()):
    device_info = audio.get_device_info_by_index(i)
    print(f"Device {i}: {device_info['name']}")

audio.terminate()
# Set up OpenAI API key
openai.api_key = "your_openai_api_key"

# Initialize the recognizer
recognizer = sr.Recognizer()

# Set language model and conversation tokens
language_model = "gpt-3.5-turbo"
conversation_tokens = []

# Helper function to generate OpenAI response
def generate_response(prompt):
    response = openai.Completion.create(
        engine=language_model,
        prompt=prompt,
        max_tokens=150,
        n=1,
        stop=None,
        temperature=0.5,
    )

    message = response.choices[0].text.strip()
    return message

# Listen to user input and generate response
while True:
    print("Listening...")

    with sr.Microphone() as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source, phrase_time_limit=5)

    try:
        user_input = recognizer.recognize_google(audio)
        print(f"You: {user_input}")

        conversation_tokens.append({"role": "system", "content": "You are GPT4."})
        conversation_tokens.append({"role": "user", "content": user_input})

        prompt = openai.PromptBuilder().add_messages(conversation_tokens).get_prompt()
        gpt4_response = generate_response(prompt)

        print(f"GPT4: {gpt4_response}")

        conversation_tokens.append({"role": "assistant", "content": gpt4_response})

    except sr.UnknownValueError:
        print("Could not understand your input, please try again.")

    except sr.RequestError as e:
        print(f"Could not request results; {e}")