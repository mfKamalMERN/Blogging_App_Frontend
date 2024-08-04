import React, { useState } from 'react';
// import { useHistory } from 'react-router-dom';
import styles from '../Styles/Profile.module.css';
import Navbar from '../Component/Navbar';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [name, setName] = useState('Current User'); // Replace with actual user data
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100'); // Replace with actual user data
    const nav = useNavigate()

    const handleNameChange = (e) => setName(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle update logic here
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>My Profile</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.profilePicContainer}>
                        <img src={profilePic} alt="Profile" className={styles.profilePic} />
                        <input type="file" onChange={handleProfilePicChange} className={styles.fileInput} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Name</label>
                        <input type="text" value={name} onChange={handleNameChange} className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={handlePasswordChange} className={styles.input} />
                    </div>
                    <button type="submit" className={styles.button}>Update</button>
                </form>
                <div className={styles.followButtons}>
                    <button onClick={() => nav('/followers')} className={styles.button}>Followers</button>
                    <button onClick={() => nav('/followings')} className={styles.button}>Followings</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
