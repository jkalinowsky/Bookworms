import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddBookForm({ setBooks }) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverImg, setCoverImg] = useState(null);
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author', author);
        formData.append('coverImg', coverImg);
        formData.append('description', description);

        fetch('/add-book', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    fetch("/books")
                        .then(res => res.json())
                        .then(booksData => {
                            setBooks(booksData);
                            navigate('/');
                        })
                        .catch(error => console.error('Error fetching books:', error));
                }
            })
            .catch(error => {
                console.error('Error adding book:', error);
            });
    };

    const handleFileChange = (event) => {
        setCoverImg(event.target.files[0]);
    };

    return (
        <div className="card text-white bg-dark-subtle m-5">
            <div className="card-header">Add a new book</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="fo rm-group">
                        <label htmlFor="title" className="form-label mt-4">Title:</label>
                        <input type="text" className="form-control" id="title" placeholder="Enter title"
                               value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Author" className="form-label mt-4">Author:</label>
                        <input type="text" className="form-control" id="author" placeholder="Enter author"
                               value={author} onChange={(e) => setAuthor(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description" className="form-label mt-4">Description:</label>
                        <textarea className="form-control" id="description" rows="3" placeholder="Enter description"
                                  value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="coverimg" className="form-label mt-4">Cover Image:</label>
                        <input className="form-control" type="file" id="coverimg" accept="image/png, image/jpeg" onChange={handleFileChange} />
                    </div>
                    <button type="submit" className="btn btn-success">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default AddBookForm;
