import React from 'react';
import styles from '../Styles/Navbar.module.css';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import Localization from '../Resources/Localization.json';
import Cookies from 'universal-cookie';

const Navbar = ({ toggleForm, isLogin, fromHome, userid }) => {

    const nav = useNavigate()

    const SignOut = () => {
        if (window.confirm(`Log Out?`)) {
            const cookies = new Cookies()
            cookies.remove('token')
            localStorage.clear()
            nav('/')
            // axios.get(`https://blogging-app-backend-dpk0.onrender.com/logout`)
            //     .then(res => {
            //         if (res.data.LoggedOut) {
            //             if (fromHome) nav('/')
            //             else nav('/home')
            //         }
            //     })
            //     .catch((er) => console.log(er))
        }
    }

    const homeNavigator = () => {
        if (userid) nav('/')
        else nav('/home')
    }

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div onClick={homeNavigator} className={styles.brand}>{Localization.navbar.brand}</div>
                {/* {!isLogin && <div onClick={() => nav('/home')} className={styles.brand}><h1>🏠</h1></div>} */}
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
                            <button onClick={() => nav('/newfriends')} className={styles.navButton}>
                                <h2>🔍</h2>
                            </button>
                            <button onClick={() => nav(`/profile/${JSON.parse(localStorage.getItem('LoggedInUser'))?._id}`)} className={styles.navButton}>
                                {JSON.parse(localStorage.getItem('LoggedInUser'))?.Name}
                            </button>
                        </div>
                }
            </div>
        </nav>
    );
};

export default Navbar;
