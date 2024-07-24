from flask import Flask, render_template, request, redirect, url_for, jsonify
from config import Config
from models import db, User, Produto
from flask_migrate import Migrate

app = Flask(__name__)
app.config.from_object(Config)  # Carrega a configuração do arquivo config.py

# Inicialização do SQLAlchemy com a aplicação
db.init_app(app)

# Inicialização do Flask-Migrate com a aplicação
migrate = Migrate(app, db)

# Rota principal
@app.route('/')
def home():
    # Renderiza o template 'index.html' com todos os usuários e produtos
    return render_template('index.html', users=User.query.all(), produtos=Produto.query.all())


# Rota para adicionar um usuário
@app.route('/add', methods=['POST'])
def add_usuario():
    nome = request.form['name']
    login = request.form['login']
    email = request.form['email']
    telefone = request.form['phone']
    departamento = request.form['department']
    
    novo_usuario = User(
        nome=nome,
        login=login,
        email=email,
        telefone=telefone,
        departamento=departamento
    )
    
    db.session.add(novo_usuario)
    db.session.commit()
    
    return redirect(url_for('listar_usuarios'))



@app.route('/edit/<int:user_id>', methods=['POST'])
def edit_user(user_id):
    user = User.query.get(user_id)
    if user:
        user.nome = request.form.get('name')  # Correção: Usar parênteses
        user.login = request.form.get('login')
        user.email = request.form.get('email')
        user.telefone = request.form.get('phone')
        user.departamento = request.form.get('department')
        db.session.commit()
        return jsonify(success=True)  # Retorna JSON com sucesso
    return jsonify(success=False, message="User not found")  # Retorna JSON com erro


@app.route('/delete_user/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return redirect(url_for('listar_usuarios'))


# Rota para listar usuários
@app.route('/usuarios')
def listar_usuarios():
    usuarios = User.query.all()
    return render_template('index.html', users=usuarios, produtos=[])

# Rota para adicionar um produto
@app.route('/add_produto', methods=['POST'])
def add_produto():
    nome = request.form['nome']
    quantidade_cadastrada = request.form['quantidade_cadastrada']
    quantidade_estoque = request.form['quantidade_estoque']
    preco_custo = request.form['preco_custo']
    preco_venda = request.form['preco_venda']
    
    novo_produto = Produto(
        nome=nome,
        quantidade_cadastrada=quantidade_cadastrada,
        quantidade_estoque=quantidade_estoque,
        preco_custo=preco_custo,
        preco_venda=preco_venda
    )
    
    db.session.add(novo_produto)
    db.session.commit()
    
    return redirect(url_for('listar_produtos'))

# Rota para listar produtos
@app.route('/produtos')
def listar_produtos():
    produtos = Produto.query.all()
    return render_template('index.html', produtos=produtos, users=[])

if __name__ == '__main__':
    app.run(debug=True)
