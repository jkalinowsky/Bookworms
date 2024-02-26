import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

function ReviewForm() {
    const location = useLocation();
    const bookTitle = location.state.bookTitle;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        if (authToken) {
            fetch(`/user/reviews/${encodeURIComponent(bookTitle)}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error('Failed to fetch review data');
                    }
                })
                .then((data) => {
                    console.log('User reviews for the book:', data);
                    const userReview = data.reviews[0];
                    if (userReview) {
                        setRating(userReview.rating);
                        setComment(userReview.comment);
                        setIsEditing(true);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching review data:', error);
                });
        }
    }, [bookTitle]);



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
            comment: comment,
        };

        const token = Cookies.get('authToken');
        if (!token) {
            console.error('Token is missing');
            return;
        }

        const method = isEditing ? 'PUT' : 'POST';
        const url = `/books/${encodeURIComponent(bookTitle)}/reviews`;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                navigate('/books');
            })
            .catch((error) => {
                console.error('Error adding/updating review:', error);
            });
    };

    console.log(isEditing);

    return (
        <div className="card border-dark m-5 p-3">
            <h1 className="text-center mb-4">{isEditing ? 'Edit Review' : 'Write a Review for ' + bookTitle}</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="comment" className="col-sm-2 col-form-label">
                            Review:
                        </label>
                        <textarea className="form-control" rows="4" placeholder="Write a review.."
                            value={comment} onChange={handleCommentChange}
                        ></textarea>
                    </div>
                    <fieldset className="form-group">
                        <legend className="mt-4">
                            Rating: <output>{rating}</output>
                        </legend>
                        <label htmlFor="ratingRange" className="form-label">
                            Select Rating:
                        </label>
                        <input
                            type="range" className="form-range" id="ratingRange"
                            min="1" max="5" step="1"
                            value={rating} onChange={handleRatingChange}
                        />
                    </fieldset>
                    <button type="submit" className="btn btn-primary">
                        {isEditing ? 'Update' : 'Submit'}
                    </button>
                </fieldset>
            </form>
        </div>
    );
}

export default ReviewForm;
