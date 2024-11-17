import React, { useState } from 'react';
import styles from '../Styles/Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import Localization from '../Resources/Localization.json';
import Cookies from 'universal-cookie';

const Navbar = ({ toggleForm, isLogin, fromHome, userid }) => {
    const [isOpen, setIsOpen] = useState(false); // State to control the hamburger menu
    const FollowRequests = JSON.parse(localStorage.getItem('LoggedInUser '))?.FollowRequests;
    const nav = useNavigate();

    const SignOut = () => {
        if (window.confirm(`Log Out?`)) {
            const cookies = new Cookies();
            cookies.remove('token');
            localStorage.clear();
            nav('/');
        }
    };

    const homeNavigator = () => {
        if (userid) nav('/');
        else nav('/home');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen); // Toggle the menu open/close
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div onClick={homeNavigator} className={styles.brand}>{Localization.navbar.brand}</div>

                {/* Hamburger Icon */}
                <div className={styles.hamburger} onClick={toggleMenu}>
                    ☰
                </div>

                {/* Navbar Buttons */}
                {isLogin ? (
                    <>
                        <button onClick={() => toggleForm(false)} className={styles.navButton}>
                            Login
                        </button>
                        <button onClick={() => toggleForm(true)} className={styles.navButton}>
                            Signup
                        </button>
                    </>)
                    :
                    <div className={`${styles.navButtons} ${isOpen ? styles.show : ''}`}>
                        {
                            (
                                <>
                                    <button onClick={() => nav('/newfriends')} className={styles.navButton}>
                                        <h2>🔍</h2>
                                    </button>
                                    <button onClick={() => nav(`/emails/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)} className={styles.navButton}>
                                        Emails
                                    </button>
                                    <button onClick={SignOut} className={styles.navButton}>
                                        Log Out
                                    </button>
                                    <button onClick={() => nav(`/profile/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)} className={styles.navButton}>
                                        {JSON.parse(localStorage.getItem('LoggedInUser'))?.Name}
                                    </button>
                                    {(FollowRequests && FollowRequests.length !== 0) &&
                                        <button onClick={() => nav(`/requests/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)} className={styles.navButton} style={{ marginRight: "50px" }}>
                                            ❤️({FollowRequests.length})
                                        </button>
                                    }
                                </>
                            )
                        }
                    </div>

                }
                {/* Log Out Button outside of the hamburger menu */}
                {/* {!isLogin && (
                    <button onClick={SignOut} className={styles.navButton}>
                        Log Out
                    </button>
                )} */}
            </div>
        </nav>
    );
};

export default Navbar;