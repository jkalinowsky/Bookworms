import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [newDescription, setNewDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = () => {
        const token = Cookies.get('authToken');
        if (!token) {
            console.error('Token is missing');
            return;
        }

        fetch("http://localhost:5000/profile", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                return response.json();
            })
            .then(data => {
                setProfileData(data);
                setNewDescription(data.description);
            })
            .catch(error => console.error('Error fetching profile data:', error));
    };

    return (
        <div className="container">
            <h2 className="mb-5">My Profile</h2>
            {profileData && (
                <div>
                    <div className="card border-primary p-3 d-flex">
                        <img src={`http://localhost:5000/profile_uploads/${profileData.profilePicture}`} alt="Profile" style={{ width: '100px', height: '100px' }} />
                        <h3 className="ml-3 position-absolute top-50 translate-middle-y" style={{ margin: '0', left: '110px' }}>{profileData.username}</h3>
                        <button className="btn btn-info position-absolute top-50 mr-3 end-0 translate-middle-y">Edit Profile</button>
                    </div>
                    <div className="card text-white bg-secondary p-3 my-3">
                        <h5>Description:</h5>
                        <p>{profileData.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfilePage;
