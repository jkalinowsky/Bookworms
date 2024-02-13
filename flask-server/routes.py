from flask import jsonify, request, send_from_directory, make_response
from server import app
from models import Book, User, Review
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
from server import db
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
    unset_jwt_cookies, jwt_required, JWTManager

app.config['JWT_SECRET_KEY'] = app.config['SECRET_KEY']
jwt = JWTManager(app)

UPLOAD_FOLDER = 'uploads'
PROFILE_UPLOAD_FOLDER = 'profile_uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROFILE_UPLOAD_FOLDER'] = PROFILE_UPLOAD_FOLDER
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/uploads/<path:filename>')
def serve_image(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/profile_uploads/<path:filename>')
def serve_profile_image(filename):
    return send_from_directory(app.config['PROFILE_UPLOAD_FOLDER'], filename)


@app.route('/books')
def get_books():
    page = request.args.get('page', default=1, type=int)
    per_page = request.args.get('per_page', default=6, type=int)

    start_index = (page - 1) * per_page
    end_index = start_index + per_page

    all_books = Book.query.all()
    books = all_books[start_index:end_index]

    return jsonify({
        'books': [book.serialize() for book in books],
        'total_pages': len(all_books) // per_page + 1,
        'total_books': len(all_books)
    })


@app.route('/add-book', methods=['POST'])
def add_book():
    title = request.form['title']
    author = request.form['author']
    description = request.form['description']

    if not title or not author or not description:
        return jsonify({'error': 'Title, author, or description cannot be empty.'}), 400

    existing_book = Book.query.filter_by(title=title).first()
    if existing_book:
        return jsonify({'error': 'Book with this title already exists.'}), 400

    if 'coverImg' not in request.files:
        return jsonify({'error': 'No file part.'}), 400

    file = request.files['coverImg']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        book = Book(title=title, author=author, image_url=filename, description=description)
        db.session.add(book)
        db.session.commit()
        return jsonify({'success': True}), 201
    else:
        return jsonify({'error': 'File type not allowed'}), 400


@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required.'}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists.'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, password_hash=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.id)
        response = make_response(jsonify({'message': 'Login successful'}))
        response.set_cookie('authToken', access_token)
        return response, 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = jsonify({"message": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'username': user.username,
            'description': user.description,
            'profilePicture': user.image_url if user.image_url else 'default.jpg'
        }), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@app.route('/books/<string:book_name>/reviews', methods=['POST'])
@jwt_required()
def add_review(book_name):
    user_id = get_jwt_identity()
    data = request.json
    rating = data.get('rating')
    comment = data.get('comment')

    if not rating or not comment:
        return jsonify({'error': 'Rating and comment are required'}), 400

    book = Book.query.filter_by(title=book_name).first()
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    review = Review(rating=rating, comment=comment, user_id=user_id, book_id=book.id)
    db.session.add(review)
    db.session.commit()

    return jsonify({'message': 'Review added successfully'}), 201

@app.route('/api/books/<string:book_name>/reviews', methods=['GET'])
def get_book_reviews(book_name):
    book = Book.query.filter_by(title=book_name).first()
    if not book:
        return jsonify({'error': 'Book not found'}), 404

    reviews = Review.query.filter_by(book_id=book.id).all()
    reviews_data = [{'id': review.id, 'rating': review.rating, 'comment': review.comment} for review in reviews]

    return jsonify({'reviews': reviews_data}), 200