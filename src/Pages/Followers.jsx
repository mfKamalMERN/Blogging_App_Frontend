import React from 'react';
import styles from '../Styles/Followers.module.css';
import Navbar from '../Component/Navbar';

const Followers = () => {
    const followers = [
        { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/50' },
        { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/50' },
        // Add more followers as needed
    ];

    return (
        <div>
            <Navbar isLogin={false} />
            <div className={styles.container}>
                <h2>Followers</h2>
                <div className={styles.list}>
                    {followers.map((follower) => (
                        <div key={follower.id} className={styles.follower}>
                            <img src={follower.avatar} alt={follower.name} className={styles.avatar} />
                            <div>{follower.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Followers;
