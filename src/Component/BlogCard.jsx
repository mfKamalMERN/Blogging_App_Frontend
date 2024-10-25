import { useState } from 'react';
import styles from '../Styles/BlogCard.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog, allUsers, isLikes, tokenChecker }) => {
    const [likes, setLikes] = useState(blog?.Likes);
    const [blogPicUrl, setBlogPicUrl] = useState(blog?.Picture);
    const [comments, setComments] = useState(blog?.Comments);
    const [newComment, setNewComment] = useState("");
    const [eComment, setEcomment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingBlog, setEditingBlog] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [editBlogPic, setEditBlogPic] = useState(false);
    const [blogContent, setBlogContent] = useState(blog.Blog);
    const [ownerdp, setOwnerdp] = useState("")
    const [title, setTitle] = useState(blog.Title)
    const [ownername, setOwnername] = useState("")
    const [file, setFile] = useState(null)
    const nav = useNavigate()


    const handleLike = async () => {
        try {
            const res = await axios.patch(`https://blogging-app-backend-dpk0.onrender.com/likeunlikeblog/${blog?._id}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`)

            setLikes(res.data.Likes)

        } catch (error) {
            console.log(error);
        }

    }

    const handleAddComment = async () => {

        if (newComment.trim() === "") alert("Please type your comment")
        else {
            try {
                const res = await axios.post(`https://blogging-app-backend-dpk0.onrender.com/addcomment/${blog._id}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, { newComment })

                setComments(res?.data?.Comments)
                setNewComment("")
                tokenChecker()
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleEditComment = (commentId) => {

        if (eComment.trim() === "") {
            alert(`Kindly Enter a comment`)
            setComments(blog.Comments);
            setEcomment(blog.Comments.find((c) => c._id == commentId).Comment);
        }
        else {
            axios.patch(`https://blogging-app-backend-dpk0.onrender.com/editcomment/${blog._id}/${commentId}`, { eComment })
                .then(res => setComments(res.data.Comments))
                .catch(er => console.log(er))
            setEditingCommentId(null);
        }
    }

    const handleDeleteComment = (commentId, blogid) => {
        if (window.confirm("Delete Comment")) {
            axios.patch(`https://blogging-app-backend-dpk0.onrender.com/deletecomment/${blogid}/${commentId}`)
                .then(res => {
                    setComments(res.data.Comments)
                    tokenChecker()
                })
                .catch(er => console.log(er))
        }
    };

    const handleEditBlog = async () => {
        try {
            const res = await axios.patch(`https://blogging-app-backend-dpk0.onrender.com/editblogtext/${blog._id}`, { blogContent, title })

            if (res.data.ValidationError) {
                res.data.ActError.map((er) => alert(er.msg))
                setBlogContent(blog.Blog)
                setTitle(blog.Title)
            }

            else {
                setBlogContent(res.data.NewBlog)
                setTitle(res.data.NewTitle)
                tokenChecker()
            }


        } catch (error) {
            console.log(error);
        }
        setEditingBlog(false);
    };

    const handleDeleteBlog = () => {

        if (window.confirm(`Delete Blog?`)) {
            axios.delete(`https://blogging-app-backend-dpk0.onrender.com/deleteblog/${blog._id}`)
                .then((res) => tokenChecker())
                .catch(er => console.log(er))
        }

    };

    const getOwnerAvatar = (ownerid) => {
        axios.get(`https://blogging-app-backend-dpk0.onrender.com/getuserdp/${ownerid}`)
            .then(res => setOwnerdp(res.data))
            .catch(er => console.log(er))
        return ownerdp
    }

    const getOwnerName = (ownerid) => {

        axios.get(`https://blogging-app-backend-dpk0.onrender.com/getusername/${ownerid}`)
            .then(res => setOwnername(res.data))
            .catch(er => console.log(er))
        return ownername
    }

    const isBlogOwner = () => blog.Owner == JSON.parse(localStorage.getItem('LoggedInUser'))?._id

    const isCommentOwner = (commentorId) => commentorId == JSON.parse(localStorage.getItem('LoggedInUser'))?._id

    const handlePicUpdate = () => {
        if (!file) alert(`No image file selected`)

        else {
            const formdata = new FormData()
            formdata.append('file', file)

            axios.put(`https://blogging-app-backend-dpk0.onrender.com/uploadblogpicture/${blog._id}/${JSON.parse(localStorage.getItem('LoggedInUser'))._id}`, formdata)
                .then(res => {
                    if (!res.data.Issue) {
                        setBlogPicUrl(res.data.url)
                        setEditBlogPic(false)
                        setFile(null)
                    }
                    else alert(res.data.Msg)
                })
                .catch(er => console.log(er))
        }
    }

    const removeBlogPic = async () => {
        try {
            if (window.confirm(`Removing Pic`)) {
                const res = await axios.patch(`https://blogging-app-backend-dpk0.onrender.com/removeblogpic/${blog._id}`)
                setBlogPicUrl(res.data.URL);
                setFile(null);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.blogCard}>
            <div className={styles.header}>

                <div onClick={() => nav(`/profile/${blog?.Owner}`)} className={styles.ownerInfo}>
                    <img src={getOwnerAvatar(blog?.Owner)} alt="" className={styles.ownerAvatar} />
                    <div className={styles.ownerName}>
                        {getOwnerName(blog?.Owner)}
                    </div>
                </div>

                {!isLikes &&
                    <div>
                        {isBlogOwner() && (
                            <div style={{ display: "flex" }}>
                                <button onClick={() => setEditingBlog(true)} className={styles.button}>✏️</button>
                                <button onClick={handleDeleteBlog} className={styles.buttonRemove}>🪣</button>
                            </div>
                        )}
                    </div>
                }

            </div>
            {editingBlog ? (
                <div>
                    <h4>Blog Title</h4>
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.textarea}
                    />
                    <h4>Blog Content</h4>
                    <textarea
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        className={styles.textarea}
                    />

                    <button onClick={handleEditBlog} className={styles.button}>Save</button>
                    <button onClick={() => setEditingBlog(false)} className={styles.button} style={{ backgroundColor: "darkred" }}>Cancel</button>
                    <br />
                    <br />
                </div>
            ) : (
                <div>
                    <h3>{blog?.Title}</h3>
                    {!editBlogPic ?
                        blogPicUrl ?
                            <>
                                <img src={blogPicUrl} alt="" width={500} />
                                {(isBlogOwner() && !isLikes) && <button onClick={() => setEditBlogPic(true)} className={styles.button}>✏️</button>}
                                {(isBlogOwner() && !isLikes) && <button onClick={removeBlogPic} className={styles.buttonRemove}>🪣</button>}
                            </>
                            :
                            isBlogOwner() && <button onClick={() => setEditBlogPic(true)} className={styles.button}>➕ Pic</button>

                        :
                        <>
                            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                            {isBlogOwner() &&
                                <>
                                    <button onClick={handlePicUpdate} className={styles.button}>Update Pic</button>
                                    <button onClick={() => { setEditBlogPic(false); setFile(null) }} className={styles.button}>Cancel</button>
                                </>
                            }
                        </>
                    }
                    <p className={styles.blogContent}> {blog?.Blog}</p>
                </div>
            )
            }
            {
                !isLikes &&
                <div className="threebuttons" style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>

                    <div className={styles.actions}>
                        {
                            likes.includes(localStorage.getItem('LoggedInUser') ? JSON.parse(localStorage.getItem('LoggedInUser'))._id : null) ?
                                <button style={{ backgroundColor: "darkgreen" }} onClick={handleLike} className={styles.button}>❤️ {likes.length}</button>
                                :
                                <button onClick={handleLike} className={styles.button}>🩶 {likes.length}</button>
                        }
                    </div>

                    <button onClick={() => nav(`/likes/${blog._id}`)} className={styles.button}>👁️ Likes</button>
                    {blog.Comments.length ?
                        <button className={styles.button} onClick={() => setShowComments(!showComments)}>📢 {blog.Comments.length}</button>
                        :
                        <button disabled={true}>📢 {blog.Comments.length}</button>
                    }

                </div>
            }

            <div className={styles.comments}>
                {
                    showComments &&
                    <>
                        <h4>Comments</h4>
                        {comments.map((comment) => (
                            <div key={comment._id} className={styles.comment}>
                                <p>
                                    <strong>{allUsers?.find((user) => user._id == comment?.CommentedBy)?.Name}</strong>: {comment?.Comment}
                                </p>
                                {isCommentOwner(comment?.CommentedBy) ? (
                                    <div>
                                        {editingCommentId === comment._id ? (
                                            <div>
                                                <textarea
                                                    value={eComment}
                                                    onChange={(e) => {
                                                        setEcomment(e.target.value)
                                                        setComments(
                                                            comments.map((c) => c._id === editingCommentId ? { ...c, Comment: e.target.value } : c))
                                                    }}
                                                    className={styles.textarea}
                                                />

                                                <button
                                                    onClick={() => handleEditComment(comment?._id)}
                                                    className={styles.button}>
                                                    Save
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setEditingCommentId(null)
                                                        setComments(blog?.Comments)
                                                    }}
                                                    className={styles.button} style={{ backgroundColor: "darkred" }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        setEditingCommentId(comment._id)
                                                        setEcomment(comment.Comment)
                                                    }}
                                                    className={styles.button}
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id, blog?._id)}
                                                    className={styles.buttonRemove}
                                                >
                                                    🪣
                                                </button>
                                            </div>
                                        )}
                                    </div>)
                                    :
                                    isBlogOwner() && <button onClick={() => handleDeleteComment(comment._id, blog?._id)} className={styles.buttonRemove}>
                                        🪣
                                    </button>
                                }
                            </div>
                        ))}
                    </>
                }

                {!isLikes &&
                    <div className={styles.addComment}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className={styles.textarea}
                            placeholder='Add Comment...'
                        />
                        {newComment?.length ? <button onClick={handleAddComment} className={styles.button}>➕Comment</button> : <></>}
                    </div>
                }
            </div>

        </div >
    );
};

export default BlogCard;
