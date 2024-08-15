import React, { useState } from 'react';
import Navbar from '../Component/Navbar';
import styles from '../Styles/NewFriendsPage.module.css';

const NewFriendsPage = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/50', isFollowing: false },
    { id: 2, name: 'Bob Smith', avatar: 'https://via.placeholder.com/50', isFollowing: true },
    { id: 3, name: 'Catherine Brown', avatar: 'https://via.placeholder.com/50', isFollowing: false },
    { id: 4, name: 'David Wilson', avatar: 'https://via.placeholder.com/50', isFollowing: false },
    { id: 5, name: 'Emily Davis', avatar: 'https://via.placeholder.com/50', isFollowing: true },
    // Add more users as needed
  ]);

  const toggleFollow = (id) => {
    setFriends((prevFriends) =>
      prevFriends.map((friend) =>
        friend.id === id ? { ...friend, isFollowing: !friend.isFollowing } : friend
      )
    );
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2>Find New Friends</h2>
        <div className={styles.friendsContainer}>
          {friends.map((friend) => (
            <div key={friend.id} className={styles.friendCard}>
              <img src={friend.avatar} alt={friend.name} className={styles.avatar} />
              <div className={styles.name}>{friend.name}</div>
              <button
                onClick={() => toggleFollow(friend.id)}
                className={friend.isFollowing ? styles.unfollowButton : styles.followButton}
              >
                {friend.isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewFriendsPage;
