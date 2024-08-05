import React from 'react';
import styles from '../Styles/Followings.module.css';
import Navbar from '../Component/Navbar';

const Followings = () => {
  const followings = [
    { id: 1, name: 'Alice Brown', avatar: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Bob White', avatar: 'https://via.placeholder.com/50' },
    // Add more followings as needed
  ];

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2>Followings</h2>
        <div className={styles.list}>
          {followings.map((following) => (
            <div key={following.id} className={styles.following}>
              <img src={following.avatar} alt={following.name} className={styles.avatar} />
              <div>{following.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Followings;
