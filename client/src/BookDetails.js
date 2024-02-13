import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function BookDetails({ book }) {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(null);

    useEffect(() => {
        fetch(`/api/books/${encodeURIComponent(book.title)}/reviews`)
            .then(response => response.json())
            .then(data => {
                setReviews(data.reviews);
                const totalRating = data.reviews.reduce((sum, review) => sum + review.rating, 0);
                const avgRating = totalRating / data.reviews.length;
                setAverageRating(avgRating.toFixed(1));
            })
            .catch(error => console.error('Error fetching reviews:', error));
    }, [book.title]);

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
            <Link to={`/books/${encodeURIComponent(book.title)}/write-review`}
                  className="btn btn-info text-decoration-none text-white w-100"
                  state={{ bookTitle: book.title }}>
                Write a review
            </Link>

            <div className="mt-4">
                <h3>Reviews:</h3>
                {reviews.length === 0 ? (
                    <p>No reviews for this book yet.</p>
                ) : (
                    <>
                        <p>Average Rating: {averageRating}</p>
                        <ul>
                            {reviews.map(review => (
                                <li key={review.id}>
                                    <p>Rating: {review.rating}</p>
                                    <p>Comment: {review.comment}</p>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default BookDetails;
