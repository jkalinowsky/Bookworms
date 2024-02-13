import React, { useState } from 'react';
import Cookies from 'js-cookie';
import {useLocation, useNavigate} from 'react-router-dom';

function ReviewForm() {
    const location = useLocation();
    const bookTitle = location.state.bookTitle;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const navigate = useNavigate();

    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            rating: rating,
            comment: comment
        };

        const token = Cookies.get('authToken');
        if (!token) {
            console.error('Token is missing');
            return;
        }

        fetch(`/books/${bookTitle}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                navigate('/books');
            })
            .catch(error => {
                console.error('Error adding review:', error);
            });
    };

    return (
        <div>
            <h1>Write a Review for {bookTitle}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Rating:</label>
                    <input type="number" min="1" max="5" value={rating} onChange={handleRatingChange} />
                </div>
                <div>
                    <label>Comment:</label>
                    <textarea value={comment} onChange={handleCommentChange} />
                </div>
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
}

export default ReviewForm;
