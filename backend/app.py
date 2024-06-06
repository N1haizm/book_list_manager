from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///book.db"
db = SQLAlchemy(app)

CORS(app)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)

@app.route('/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([{'id': book.id, 'title': book.title} for book in books])

@app.route('/books', methods=['POST'])
def add_book():
    data = request.get_json() 
    title = data.get('title') 
    if title:
        new_book = Book(title=title)
        db.session.add(new_book)
        db.session.commit()
        return jsonify({'id': new_book.id, 'title': new_book.title}), 201
    else:
        return 'Missing title field', 400

@app.route('/books/<int:id>', methods=['DELETE'])
def delete_book(id):
    book = Book.query.get_or_404(id)
    db.session.delete(book)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True, host="localhost", port=5000)
