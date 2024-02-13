import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function RegisterForm({ onClose }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();



    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
                .then(res => {
                    if (res.ok) {
                        navigate('/books');
                    } else {
                        throw new Error('Register failed');
                    }
                })
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="card text-white bg-info mx-5">
            <div className="card-header">Register</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-outline-success">Register</button>
                </form>
            </div>
        </div>
    );
}

export default RegisterForm;