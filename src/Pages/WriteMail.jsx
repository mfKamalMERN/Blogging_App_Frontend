import { useEffect, useState } from "react";
import Navbar from "../Component/Navbar";
import Cookies from "universal-cookie";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styles from '../Styles/WriteMail.module.css';
import { Suggestions } from "../Component/Suggestions";
import { HomeBackNavigations } from "../Component/HomeBackNavigations";

const WriteMail = () => {
    const [userNames, setUserNames] = useState([]);
    const [inputValue, setInputValue] = useState({ SentTo: '', CC: '', Subject: '', MailBody: '' });
    const [isCC, setIsCC] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [files, setFiles] = useState(null);
    const [error, setError] = useState(false);
    const nav = useNavigate();
    const cookies = new Cookies();
    const { userid } = useParams();
    const loggeduserid = JSON.parse(localStorage.getItem('LoggedInUser'))?._id;

    axios.defaults.withCredentials = true;

    const tokenChecker = async () => {
        if (!cookies.get('token') || !localStorage.getItem('token')) {
            localStorage.clear();
            cookies.remove('token');
            nav('/');
            return;
        }

        try {
            if (!userid) {
                const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/allusernames/${loggeduserid}`);
                setUserNames(data.usernames);
                return;
            }

            const { data } = await axios.get(`https://blogging-app-backend-dpk0.onrender.com/username/${loggeduserid}/${userid}`);
            setInputValue((pre) => ({ ...pre, SentTo: data }))

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        tokenChecker();
    }, []);

    const handleInputChange = (event) => {
        const value = event.target.value;
        setInputValue(prev => ({ ...prev, [event.target.name]: value }));
        if (event.target.name === 'SentTo') setIsCC(false)

        if (event.target.name === "CC") setIsCC(true)

        // Filter suggestions based on the input value
        if (value && (event.target.name === 'SentTo' || event.target.name === "CC")) {
            const filteredSuggestions = userNames.filter(username => username.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filteredSuggestions);
        } else setSuggestions([]);
    };

    const handleSuggestionClick = (suggestion) => {
        if (isCC) {
            setInputValue(prev => ({ ...prev, CC: suggestion }));
            setSuggestions([]); // Clear suggestions after selection
            setIsCC(false);
            return;
        }
        setInputValue(prev => ({ ...prev, SentTo: suggestion }));
        setSuggestions([]); // Clear suggestions after selection
    };

    const SendMail = (e) => {
        e.preventDefault();

        if (!Object.values(inputValue)[0]) {
            alert("Please enter a valid username");
            return;
        }

        const formdata = new FormData();
        formdata.append('SentTo', inputValue.SentTo);
        formdata.append('CC', inputValue.CC);
        formdata.append('Subject', inputValue.Subject);
        formdata.append('MailBody', inputValue.MailBody);

        if (files && files.length > 0) {
            for (let file of files) {
                formdata.append('files', file);
            }
        }

        axios.post(`https://blogging-app-backend-dpk0.onrender.com/newmail/${loggeduserid}`, formdata)
            .then(res => {
                alert(res.data.message);
                setFiles(null);
                nav(`/emails/${loggeduserid}`);
            })
            .catch(error => {
                setError(error.message);
                console.error(error.message)
            })
    }
    if (error) return <h1 style={{ color: "darkred", textAlign: "center", marginLeft: "5%" }}>Internal Server Error...Please try again later!</h1>

    return (
        <>
            <Navbar />
            <br />
            <HomeBackNavigations styles={styles} WM={true} />
            <form onSubmit={SendMail} className="container" style={{ color: "wheat", marginTop: "30px", width: "50%", marginLeft: "25%" }}>
                <label htmlFor="to">To:</label>
                <input
                    type="text"
                    id="to"
                    value={inputValue.SentTo}
                    onChange={handleInputChange}
                    name="SentTo"
                />

                {suggestions.length > 0 && !isCC && suggestions.map((sugg, idx) => (
                    <Suggestions key={idx} suggestion={sugg} handleSuggestionClick={handleSuggestionClick} />
                ))}

                <br />
                <label htmlFor="cc">CC:</label>
                <input
                    type="text"
                    id="cc"
                    value={inputValue.CC}
                    onChange={handleInputChange}
                    name="CC"
                />

                {suggestions.length > 0 && isCC && suggestions.map((sugg, idx) => (
                    <Suggestions key={idx} suggestion={sugg} handleSuggestionClick={handleSuggestionClick} />
                ))}

                <br />
                <label htmlFor="subject">Subject:</label>
                <input
                    type="text"
                    id="subject"
                    value={inputValue.Subject}
                    onChange={handleInputChange}
                    name="Subject"
                />

                <br />
                <label htmlFor="mailbody">Mail:</label>
                <textarea id="mailbody" value={inputValue.MailBody} onChange={handleInputChange} name="MailBody" />

                {/* <br />
                <label htmlFor="attachments">Attachments:</label>
                <input id="attachments" type="file" multiple onChange={(e) => setFiles(e.target.files)} /> */}
                <br />
                <br />
                <button type="submit">Send</button>

            </form>
        </>
    );
}

export { WriteMail };