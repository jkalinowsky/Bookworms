from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import secrets

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///books.db'
db = SQLAlchemy(app)
CORS(app, origins='http://localhost:3000', supports_credentials=True)

secret_key = secrets.token_hex(16)
app.config['SECRET_KEY'] = secret_key

import routes

if __name__ == '__main__':
    app.run(debug=True)