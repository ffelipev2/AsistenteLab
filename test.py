from flask import Flask, render_template, request
from openai import OpenAI

app = Flask(__name__)

# Configura el cliente que apunta a la dirección de tu modelo local
client = OpenAI(base_url="http://localhost:1234/v1", api_key="not-needed")


@app.route("/", methods=["GET", "POST"])
def chat():
    response_text = ""
    if request.method == "POST":
        # Obtiene el mensaje de la caja de entrada del formulario
        user_message = request.form["user_message"]

        # Realiza la consulta al modelo
        completion = client.chat.completions.create(
            model="local-model",
            messages=[
                {"role": "system",
                 "content": "Eres un asistente que ofrece información certera y no muy extensa sobre los temas consultados."},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
        )
        response_text = completion.choices[0].message.content

    return render_template("index.html", response_text=response_text)


if __name__ == "__main__":
    app.run(debug=True)
