from flask import Flask, render_template, request
from openai import OpenAI

app = Flask(__name__)

# Configura el cliente que apunta a la dirección de tu modelo local
client = OpenAI(base_url="http://localhost:1234/v1", api_key="not-needed")

# Función para leer el archivo .txt
def cargar_texto_desde_archivo(ruta_archivo):
    with open(ruta_archivo, "r") as archivo:
        return archivo.read()

# Carga el archivo de texto
contenido_aprendizaje = cargar_texto_desde_archivo("aprendizaje.txt")

@app.route("/", methods=["GET", "POST"])
def chat():
    response_text = ""
    if request.method == "POST":
        user_message = request.form["user_message"]

        # Realiza la consulta al modelo con el contenido del archivo .txt
        completion = client.chat.completions.create(
            model="local-model",
            messages=[
                {"role": "system",
                 "content": "Eres un asistente que ofrece información certera y no muy extensa sobre los temas consultados."},
                {"role": "system", "content": f"Contexto adicional: {contenido_aprendizaje}"},
                {"role": "user", "content": user_message}
            ],
            temperature=0.7,
        )
        response_text = completion.choices[0].message.content

    return render_template("index.html", response_text=response_text)


if __name__ == "__main__":
    app.run(debug=True)
