import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";

function BookDetails({ book }) {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);
    const [authToken, setAuthToken] = useState(() => Cookies.get('authToken'));
    const [userReviews, setUserReviews] = useState([]);

    useEffect(() => {
        fetch(`/books/${encodeURIComponent(book.title)}/reviews`)
            .then(response => response.json())
            .then(data => {
                setReviews(data.reviews);
                const totalRating = data.reviews.reduce((sum, review) => sum + review.rating, 0);
                const avgRating = totalRating / data.reviews.length;
                setAverageRating(avgRating.toFixed(1));
            })
            .catch(error => console.error('Error fetching reviews:', error));

        if (authToken) {
            fetch(`/user/reviews/${encodeURIComponent(book.title)}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            })
                .then(response => response.json())
                .then(data => setUserReviews(data.reviews))
                .catch(error => console.error('Error fetching user reviews:', error));
        }
    }, [book.title, authToken]);

    const hasReviewed = userReviews.length === 1;

    return (
        <div className="container">
            <div className="card text-white bg-primary mb-3">
                <div className="card-header">
                    <h1 className="card-title">{book.title}</h1>
                    <h3 className="card-subtitle mb-2 text-light">{book.author}</h3>
                </div>
                <div className="card-body d-flex p-3">
                    <img src={`http://localhost:5000/uploads/${book.image_url}`}
                         className="img-fluid rounded mb-3" alt={book.title}
                         style={{ width: '200px', height: '300px', objectFit: 'cover' }}/>
                    <p className="card-text mx-5">{book.description}</p>
                </div>
            </div>
            {authToken && !hasReviewed && (
                <Link to={`/books/${encodeURIComponent(book.title)}/write-review`}
                      className="btn btn-info text-decoration-none text-white w-100"
                      state={{ bookTitle: book.title }}>
                    Write a review
                </Link>
            )}
            {authToken && hasReviewed && (
                <Link to={`/books/${encodeURIComponent(book.title)}/write-review`}
                      className="btn btn-info text-decoration-none text-white w-100"
                      state={{ bookTitle: book.title }}>
                    Edit review
                </Link>
            )}

            <div className="card text-white bg-primary mb-3 mt-4">
                <div className="card-body p-3">
                    <h3>Reviews:</h3>
                    {reviews.length === 0 ? (
                        <p>No reviews for this book yet.</p>
                    ) : (
                        <>
                            <p>Average Rating: {averageRating}</p>
                            {reviews.map(review => (
                            <div key={review.id} className="card my-2 bg-light">
                                <div className="card-body">
                                    <h5>{review.user_nickname} -  {review.rating}/5</h5>
                                    <p className="mt-3"> {review.comment}</p>
                                </div>
                            </div>
                            ))}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
}

export default BookDetails;
