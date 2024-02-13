import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function BooksList() {
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetch(`/books?page=${page}&per_page=${perPage}`)
            .then(res => res.json())
            .then(data => {
                setBooks(data.books);
                setTotalPages(data.total_pages);
            })
            .catch(error => console.error('Error fetching books:', error));
    }, [page, perPage]);

    const handleNextPage = () => {
        setPage(page + 1);
    };

    const handlePrevPage = () => {
        setPage(page - 1);
    };

    const handlePerPageChange = (e) => {
        setPerPage(e.target.value);
        setPage(1);
    };

    return (
        <div className="container">
            {books.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div className="row">
                        {books.map((book, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <Link to={`/${encodeURIComponent(book.title)}`} className="text-decoration-none text-dark">
                                    <div className="card text-white bg-primary">
                                        <div className="card-header">
                                            <h5 className="card-title">{book.title}</h5>
                                            <p className="card-text">{book.author}</p>
                                        </div>
                                        <div className="card-body">
                                            <img src={`http://localhost:5000/uploads/${book.image_url}`}
                                                 className="card-img-top" alt={book.title}
                                                 style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <div className="row mt-4 mb-2">
                        <div className="col">
                            <button className="btn btn-primary mr-2" disabled={page === 1} onClick={handlePrevPage}>Previous</button>
                            <button className="btn btn-primary" disabled={page === totalPages} onClick={handleNextPage}>Next</button>
                        </div>
                        <div className="col text-right">
                            <select className="form-select" value={perPage} onChange={handlePerPageChange}>
                                <option value="6">6 per page</option>
                                <option value="12">12 per page</option>
                                <option value="18">18 per page</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BooksList;
