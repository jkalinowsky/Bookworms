import React from 'react'

function BookDetails({ book }) {
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
        </div>
    );
}

export default BookDetails;