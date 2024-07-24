from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('config.Config')  # Certifique-se de que você carregou as configurações

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'usuarios'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50))
    login = db.Column(db.String(50))
    email = db.Column(db.String(50))
    telefone = db.Column(db.String(20))
    departamento = db.Column(db.String(50))

class Produto(db.Model):
    __tablename__ = 'produtos'
    
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(50))
    quantidade_cadastrada = db.Column(db.Integer)
    quantidade_estoque = db.Column(db.Integer)
    preco_custo = db.Column(db.Numeric(10, 2))
    preco_venda = db.Column(db.Numeric(10, 2))
