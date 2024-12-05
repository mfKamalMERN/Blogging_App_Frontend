import React, { useEffect, useState } from 'react';
import styles from '../Styles/RequestedUsers.module.css';
import Navbar from '../Component/Navbar';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { HomeBackNavigations } from '../Component/HomeBackNavigations';
import { toast } from 'react-toastify';

const FollowRequests = () => {

    const [requestedUsers, setRequestedUsers] = useState([]);
    const [rstatus, setRstatus] = useState(false);
    const { loggeduserid } = useParams();
    const nav = useNavigate();

    axios.defaults.withCredentials = true

    const tokenChecker = async () => {
        const cookies = new Cookies();

        if (!cookies.get('token') || !loggeduserid) {
            localStorage.clear()
            cookies.remove('token')
            nav('/')
            return;
        }

        try {
            const res = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/getrequests/${loggeduserid}`)
            if (!res.data) {
                console.log(`Invalid response from server`)
                return;
            }

            console.log(res.data.Requests);
            setRequestedUsers(res.data.Requests);

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        tokenChecker()
    }, [rstatus])

    const handleAccept = (id) => {

        axios.patch(`https://blogging-app-backend-dpk0.onrender.com/acceptrequest/${loggeduserid}`, { userid: id })
            .then((response) => {

                if (!response.data) {
                    console.log(`Invalid response from server`)
                    return;
                }

                if (response.data.RequestUpdated) {

                    console.log(response.data.message);
                    setRstatus(!rstatus);

                    return;
                }

                toast(response.data.message);

            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleReject = (id) => {
        axios.patch(`https://blogging-app-backend-dpk0.onrender.com/rejectrequest/${loggeduserid}`, { userid: id })
            .then((response) => {

                if (!response.data) {
                    console.log(`Invalid response from server`)
                    return;
                }

                if (response.data.RequestUpdated) {

                    console.log(response.data.message);
                    setRstatus(!rstatus);

                    return;
                }
                toast(response.data.message);

            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Navbar />
            <br />
            <HomeBackNavigations styles={styles} FR={true} />
            <div className={styles.container}>
                <h2 className={styles.header}>Follow Requests</h2>
                {requestedUsers.length === 0 ? (
                    <p className={styles.message}>No follow requests at the moment.</p>
                ) : (
                    <ul className={styles.list}>
                        {requestedUsers.map((request, idx) => (
                            <li key={idx} className={styles.listItem}>

                                <div className="user" onClick={() => nav(`/profile/${request._id}`)}>
                                    <img src={request.DP} alt={`${request.username}'s profile`} className={styles.profilePic} />
                                    <span className={styles.username}>{request.Name}</span>
                                </div>
                                <div className="buttons">

                                    <button onClick={() => handleAccept(request._id)} className={styles.buttonAccept}>Accept</button>
                                    <button onClick={() => handleReject(request._id)} className={styles.buttonReject}>Delete</button>
                                </div>
                                {/* <hr /> */}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default FollowRequests;