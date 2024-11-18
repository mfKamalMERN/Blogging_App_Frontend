import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../Component/Navbar";
import styles from '../Styles/Emails.module.css'; // Import the CSS file for styling

export const Emails = () => {
    const [emails, setEmails] = useState([]);
    const [axiosError, setAxioserror] = useState(false);
    const nav = useNavigate();
    const { loggeduserid, sentmails } = useParams();
    const cookies = new Cookies();


    axios.defaults.withCredentials = true;

    const tokenChecker = async () => {
        if (!cookies.get('token') || !localStorage.getItem('token')) {
            localStorage.clear();
            cookies.remove('token');
            nav('/');
            return;
        }

        try {
            if (!sentmails) {
                const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/emailsreceived/${loggeduserid}`);
                setEmails(data);
                return;
            }

            const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/emailssent/${loggeduserid}`);
            setEmails(data);
            return;

        } catch (error) {
            console.error(error);
            setAxioserror(true);
        }
    };

    useEffect(() => {
        tokenChecker();
    }, [sentmails]);

    const handleEmailClick = (emailId) => nav(`/email/${emailId}`); // Navigate to the email detail page

    const handleInboxSentToggele = () => {
        if (!sentmails) {
            nav(`/emails/${loggeduserid}/${true}`)
            return
        }
        nav(`/emails/${loggeduserid}`)
    }


    return (
        axiosError ? <div style={{ color: "wheat" }}>Something went wrong</div> :
            <>
                <Navbar />

                <div className={styles.mailbuttons}>
                    <button className={styles.button} onClick={() => nav(`/newmail`)}>Compose ✏️</button>
                    <button className={styles.button} onClick={handleInboxSentToggele}>{sentmails ? "View Inbox" : "Sent Mails"}</button>
                </div>


                {!emails.length ? <h1 className={styles.noEmails}>No Emails for now...</h1> : emails?.map((email) => (
                    <div className={styles.emailbar} key={email._id} onClick={() => handleEmailClick(email._id)}>
                        <h4>{!sentmails ? (`From: ${email?.SentBy}`) : (`To: ${email?.SentTo}`)}</h4>
                        <h5>Subject: {email?.Subject}</h5>
                    </div>
                ))}
            </>
    );
};