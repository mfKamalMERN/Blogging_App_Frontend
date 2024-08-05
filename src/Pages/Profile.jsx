import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Styles/Profile.module.css';
import Navbar from '../Component/Navbar';

const Profile = () => {
    const [name, setName] = useState('Current User'); // Replace with actual user data
    const [password, setPassword] = useState('');
    const [File, setFile] = useState(null);
    const [profilePic, setProfilePic] = useState('https://via.placeholder.com/100'); // Replace with actual user data
    const nav = useNavigate();

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

    const handleNameUpdate = (e) => {
        e.preventDefault();
        // Handle name update logic here
        alert('Name updated successfully');
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        // Handle password update logic here
        alert('Password updated successfully');
    };

    const handleProfilePicUpdate = (e) => {
        e.preventDefault();
        // Handle profile pic update logic here
        alert('Profile picture updated successfully');
    };

    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                <h2>My Profile</h2>
                <form className={styles.form}>
                    <div className={styles.profilePicContainer}>
                        <img src={profilePic} alt="Profile" className={styles.profilePic} />
                        <input type="file" onChange={handleProfilePicChange} className={styles.fileInput} />
                        <button onClick={handleProfilePicUpdate} className={styles.button}>Update Profile Pic</button>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Name</label>
                        <input type="text" value={name} onChange={handleNameChange} className={styles.input} />
                        <button onClick={handleNameUpdate} className={styles.button}>Update Name</button>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password</label>
                        <input type="password" value={password} onChange={handlePasswordChange} className={styles.input} />
                        <button onClick={handlePasswordUpdate} className={styles.button}>Update Password</button>
                    </div>
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
