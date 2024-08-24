import React, { useEffect, useState } from 'react';
import styles from '../Styles/BlogCard.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog, allUsers, isLikes }) => {
    const [likes, setLikes] = useState(blog?.Likes);
    const [comments, setComments] = useState(blog?.Comments);
    const [newComment, setNewComment] = useState("");
    const [eComment, setEcomment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingBlog, setEditingBlog] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [dpa, setDpa] = useState(false);
    const [blogContent, setBlogContent] = useState(blog.Blog);
    const [ownerdp, setOwnerdp] = useState("")
    const [title, setTitle] = useState(blog.Title)
    const [ownername, setOwnername] = useState("")
    const nav = useNavigate()


    const handleLike = async () => {
        try {
            const res = await axios.patch(`https://blogging-app-backend-dpk0.onrender.com/likeunlikeblog/${blog?._id}`)

            setLikes(res.data.Likes)

        } catch (error) {
            console.log(error);
        }

    }

    const handleAddComment = async () => {

        if (newComment.trim() === "") alert("Please type your comment")
        else {
            try {
                const res = await axios.post(`https://blogging-app-backend-dpk0.onrender.com/addcomment/${blog._id}`, { newComment })

                setComments(res?.data?.Comments)
                setNewComment("")

            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleEditComment = (commentId) => {

        if (eComment.trim() === "") {
            alert(`Kindly Enter a comment`)
            setComments(blog.Comments)
        }
        else {
            axios.patch(`https://blogging-app-backend-dpk0.onrender.com/editcomment/${blog._id}/${commentId}`, { eComment })
                .then(res => setComments(res.data.Comments))
                .catch(er => console.log(er))

        }
        setEditingCommentId(null);
    }

    const handleDeleteComment = (commentId, blogid) => {

        axios.patch(`https://blogging-app-backend-dpk0.onrender.com/deletecomment/${blogid}/${commentId}`)
            .then(res => setComments(res.data.Comments))
            .catch(er => console.log(er))
    };

    const handleEditBlog = async () => {
        try {
            const res = await axios.patch(`https://blogging-app-backend-dpk0.onrender.com/editblogtext/${blog._id}`, { blogContent, title })

            if (res.data.ValidationError) res.data.ActError.map((er) => alert(er.msg))

            else {
                setBlogContent(res.data.NewBlog)
                setTitle(res.data.NewTitle)
            }


        } catch (error) {
            console.log(error);
        }
        setEditingBlog(false);
    };

    const handleDeleteBlog = () => {

        if (window.confirm(`Delete Blog?`)) {
            axios.delete(`https://blogging-app-backend-dpk0.onrender.com/deleteblog/${blog._id}`)
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
                        {blog?.Owner === JSON.parse(localStorage.getItem('LoggedInUser'))?._id && (
                            <div style={{ display: "flex" }}>
                                <button onClick={() => setEditingBlog(true)} className={styles.button}>✏️</button>
                                <button onClick={handleDeleteBlog} className={styles.button}>🪣</button>
                            </div>
                        )}
                    </div>
                }

            </div>
            {editingBlog ? (
                <div>
                    <textarea
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        className={styles.textarea}
                    />
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.textarea}
                    />

                    <button onClick={handleEditBlog} className={styles.button}>Save</button>
                    <br />
                    <br />
                </div>
            ) : (
                <div>
                    <h3>{blog?.Title}</h3>
                    <p style={{ maxWidth: "500px", color: "white" }}>{blog?.Blog}</p>
                </div>
            )}
            {!isLikes &&
                <div className="threebuttons" style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>

                    <div className={styles.actions}>
                        {
                            likes.includes(JSON.parse(localStorage.getItem('LoggedInUser'))._id) ?
                                <button style={{ backgroundColor: "darkgreen" }} onClick={handleLike} className={styles.button}>  ❤️({likes.length})</button>
                                :
                                <button onClick={handleLike} className={styles.button}>🩶({likes.length})</button>
                        }
                    </div>

                    <button onClick={() => nav(`/likes/${blog._id}`)} className={styles.button}>ℹ️ 💕</button>

                    <button className={styles.button} onClick={() => setShowComments(!showComments)}>ℹ️ 💭</button>

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
                                {comment?.CommentedBy == JSON.parse(localStorage.getItem('LoggedInUser'))?._id && (
                                    <div>
                                        {editingCommentId === comment._id ? (
                                            <div>
                                                <textarea
                                                    value={eComment}
                                                    onChange={(e) => {
                                                        setEcomment(e.target.value)
                                                        setComments(
                                                            comments.map((c) => c._id === comment._id ? { ...c, Comment: e.target.value } : c))
                                                    }
                                                    }
                                                    className={styles.textarea}
                                                />
                                                <button
                                                    onClick={() => handleEditComment(comment?._id)}
                                                    className={styles.button}
                                                >
                                                    Save
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
                                                    className={styles.button}
                                                >
                                                    🪣
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
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
                        <button onClick={handleAddComment} className={styles.button}>➕Comment</button>
                    </div>
                }
            </div>

        </div>
    );
};

export default BlogCard;
