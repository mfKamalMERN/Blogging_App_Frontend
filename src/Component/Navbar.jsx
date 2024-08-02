import React from 'react';
import styles from '../Styles/Navbar.module.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ isSignup, toggleForm }) => {
    const nav = useNavigate()
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div onClick={() => nav('/home')} className={styles.brand}>BlogApp</div>
                <div className={styles.navButtons}>
                    <button onClick={() => toggleForm(false)} className={styles.navButton}>
                        Login
                    </button>
                    <button onClick={() => toggleForm(true)} className={styles.navButton}>
                        Signup
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
