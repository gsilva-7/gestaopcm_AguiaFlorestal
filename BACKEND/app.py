from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def conectar_db():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def criar_tabelas():
    conn = conectar_db()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, usuario TEXT UNIQUE, senha TEXT, cargo TEXT)''')
    cursor.execute('''CREATE TABLE IF NOT EXISTS ordens (id INTEGER PRIMARY KEY, solicitante TEXT, maquina TEXT, horimetro TEXT, problema TEXT, prioridade TEXT, data TEXT, status TEXT)''')
    cursor.execute("INSERT OR IGNORE INTO usuarios (usuario, senha, cargo) VALUES ('admin', '123', 'PCM')")
    cursor.execute("INSERT OR IGNORE INTO usuarios (usuario, senha, cargo) VALUES ('mecanico01', '456', 'MANUTENTOR')")
    conn.commit()
    conn.close()

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    conn = conectar_db()
    user = conn.execute('SELECT * FROM usuarios WHERE usuario = ? AND senha = ? AND cargo = ?', 
                        (data.get('usuario'), data.get('senha'), data.get('cargo'))).fetchone()
    conn.close()
    if user:
        return jsonify({"sucesso": True, "nome": user['usuario'], "cargo": user['cargo']}), 200
    return jsonify({"sucesso": False, "mensagem": "Erro no Login"}), 401

@app.route('/os', methods=['GET'])
def listar_os():
    conn = conectar_db()
    ordens = conn.execute('SELECT * FROM ordens').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in ordens])

if __name__ == '__main__':
    criar_tabelas()
    app.run(debug=True)