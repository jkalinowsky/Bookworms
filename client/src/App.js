import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes, Link, NavLink, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import AddBookForm from './AddBookForm';
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import BookDetails from './BookDetails';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/journal/bootstrap.min.css';
import ProfilePage from "./ProfilePage";
import BooksList from "./BooksList";

function App() {
    const [books, setBooks] = useState([]);
    const [authToken, setAuthToken] = useState(() => Cookies.get('authToken'));

    const handleLogout = () => {
        const token = Cookies.get('authToken');

        fetch("http://localhost:5000/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            credentials: "include",
        })
            .then(res => {
                console.log('Logout response:', res);
                if (res.ok) {
                    Cookies.remove('authToken');
                    setAuthToken(false);
                } else {
                    throw new Error('Logout failed');
                }
            })
            .catch(error => console.error('Error logging out:', error));
    };


    return (
        <Router>
            <nav className="navbar navbar-expand-lg bg-primary mb-5" data-bs-theme="dark">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse justify-content-between" id="navbarColor01">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <NavLink exact={true} to="/" className="nav-link" activeclassname="active">All Books</NavLink>
                            </li>
                            {authToken && (
                                <>
                                    <li className="nav-item">
                                        <NavLink to="/add-book" className="nav-link" activeclassname="active">Add Book</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/profile" className="nav-link" activeclassname="active">My Profile</NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                        <div className="navbar-nav">
                            {authToken ? (
                                <button onClick={handleLogout} className="btn btn-danger text-white ">Logout</button>
                            ) : (
                                <>
                                    <NavLink to="/register" className="btn btn-info text-white mr-3">Register</NavLink>
                                    <NavLink to="/login" className="btn btn-danger text-white">Login</NavLink>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <Routes>
                <Route path="/" element={<BooksList setBooks={setBooks} />} /> {/* Pass setBooks function */}
                <Route path="/add-book" element={<AddBookForm setBooks={setBooks} />} /> {/* Pass setBooks function */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/:bookName" element={<BookDetailsPage books={books} />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

function BookDetailsPage({ books }) {
    const { bookName } = useParams();
    const decodedBookName = decodeURIComponent(bookName);
    const book = books.find((book) => book.title === decodedBookName);

    if (!book) {
        return <div>Book not found</div>;
    }

    return <BookDetails book={book} />;
}

export default App;