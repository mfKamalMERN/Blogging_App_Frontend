import React from 'react';
import styles from '../Styles/Navbar.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = ({ isSignup, toggleForm, isLogin }) => {
    const nav = useNavigate()

    const SignOut = () => {
        if (window.confirm(`Log Out?`)) {

            axios.get(`http://localhost:7500/logout`)
                .then((res) => nav('/'))
                .catch((er) => console.log(er))
        }
    }
    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div onClick={() => nav('/home')} className={styles.brand}>BlogApp</div>
                {
                    isLogin ?
                        <div className={styles.navButtons}>
                            <button onClick={() => toggleForm(false)} className={styles.navButton}>
                                Login
                            </button>
                            <button onClick={() => toggleForm(true)} className={styles.navButton}>
                                Signup
                            </button>
                        </div>
                        :
                        <div className={styles.navButtons}>
                            <button onClick={SignOut} className={styles.navButton}>
                                Log Out
                            </button>
                            <button className={styles.navButton}>
                                {JSON.parse(localStorage.getItem('LoggedInUser'))?.Name}
                            </button>
                        </div>
                }
            </div>
        </nav>
    );
};

export default Navbar;
