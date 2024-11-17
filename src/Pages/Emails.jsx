import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import Navbar from "../Component/Navbar";
import styles from '../Styles/Emails.module.css'; // Import the CSS file for styling

export const Emails = () => {
    const [emails, setEmails] = useState([{ sentBy: "John", Subject: "Subject demo", _id: 11 }, { sentBy: "John", Subject: "Subject demo", _id: 12 }, { sentBy: "John", Subject: "Subject demo", _id: 13 }, { sentBy: "John", Subject: "Subject demo", _id: 14 }, { sentBy: "John", Subject: "Subject demo", _id: 15 }]);
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
                const { data } = await axios.get(`http://localhost:7500/emailsreceived/${loggeduserid}`);
                console.log(data);
                setEmails(data);
                return;
            }

            const { data } = await axios.get(`http://localhost:7500/emailssent/${loggeduserid}`);
            setEmails(data);
            return;

        } catch (error) {
            console.error(error);
            setAxioserror(true);
        }
    };

    useEffect(() => {
        tokenChecker();
    }, []);

    const handleEmailClick = (emailId) => nav(`/email/${emailId}`); // Navigate to the email detail page


    return (
        // !axiosError ? <div style={{ color: "wheat" }}>Something went wrong</div> :
        <>
            <Navbar />


            <div className={styles.mailbuttons}>
                <button className={styles.button} onClick={() => nav(`/newmail`)}>Compose ✏️</button>
                <button className={styles.button} onClick={() => nav(`/emails/${loggeduserid}/${true}`)}>Sent Mails</button>
            </div>


            {emails?.map((email) => (
                <div className={styles.emailbar} key={email._id} onClick={() => handleEmailClick(email._id)}>
                    <h2>{email?.SentBy}</h2>
                    <h3>{email?.Subject}</h3>
                </div>
            ))}
        </>
    );
};