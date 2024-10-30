import axios from "axios";

export const enableContactView = (sc, setShowcontact) => {
    const loggeduserid = JSON.parse(localStorage.getItem('LoggedInUser'))?._id;

    if (!loggeduserid) {
        alert(`Invalid User id`);
        return;
    }

    axios.patch(`https://blogging-app-backend-dpk0.onrender.com/showhidecontact`, { loggeduserid, Showcontact: sc })
        .then((res) => {
            if (!res.data) {
                console.log(`Invalid response from server while deleting contact`);
                return;
            }

            if (res.data.ContactVisibilityUpdated) {
                setShowcontact(res.data.ShowContact);
                alert(res.data.message);
                return;
            }
            alert(res.data.message);
        })
        .catch(error => {
            console.log(`Error updating showhide contact`, error);
        })

}

export const checkFollowingStatus = (Followers) => Followers.includes(JSON.parse(localStorage.getItem('LoggedInUser'))?._id)

export const changeAccountPrivacy = (pa, setPrivateaccount) => {
    // const isPrivate = !privateAccount
    axios.patch(`https://blogging-app-backend-dpk0.onrender.com/privatepublic/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, { isPrivate: pa })
        .then(res => {
            setPrivateaccount(pa)
            alert(res.data)
        })
        .catch(er => console.log(er))
}