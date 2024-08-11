import React, { useState } from 'react';
import styles from '../Styles/BlogCard.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog, allUsers }) => {
    const [likes, setLikes] = useState(blog?.Likes);
    const [comments, setComments] = useState(blog.Comments);
    const [newComment, setNewComment] = useState("");
    const [eComment, setEcomment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingBlog, setEditingBlog] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [blogContent, setBlogContent] = useState(blog.Blog);
    const [ownerdp, setOwnerdp] = useState("")
    const [title, setTitle] = useState(blog.Title)
    const [ownername, setOwnername] = useState("")
    const nav = useNavigate()


    const handleLike = async () => {
        try {
            const res = await axios.patch(`http://localhost:7500/likeunlikeblog/${blog._id}`)

            setLikes(res.data.Likes)

        } catch (error) {
            console.log(error);
        }

    };

    const handleAddComment = async () => {

        if (newComment.trim() === "") alert("Please type your comment")
        else {
            try {
                const res = await axios.post(`http://localhost:7500/addcomment/${blog._id}`, { newComment })

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
            axios.patch(`http://localhost:7500/editcomment/${blog._id}/${commentId}`, { eComment })
                .then(res => setComments(res.data.Comments))
                .catch(er => console.log(er))

        }
        setEditingCommentId(null);
    }

    const handleDeleteComment = (commentId, blogid) => {

        axios.patch(`http://localhost:7500/deletecomment/${blogid}/${commentId}`)
            .then(res => setComments(res.data.Comments))
            .catch(er => console.log(er))
    };

    const handleEditBlog = async () => {
        try {
            const res = await axios.patch(`http://localhost:7500/editblogtext/${blog._id}`, { blogContent, title })

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
            axios.delete(`http://localhost:7500/deleteblog/${blog._id}`)
                // .then(res => alert(res.data))
                .catch(er => console.log(er))
        }

    };

    const getOwnerAvatar = (ownerid) => {
        axios.get(`http://localhost:7500/getuserdp/${ownerid}`)
            .then(res => setOwnerdp(res.data))
            .catch(er => console.log(er))
        return ownerdp
    }

    const getOwnerName = (ownerid) => {

        axios.get(`http://localhost:7500/getusername/${ownerid}`)
            .then(res => setOwnername(res.data))
            .catch(er => console.log(er))
        return ownername

    }


    return (
        <div className={styles.blogCard}>
            <div className={styles.header}>

                <div onClick={() => nav(`/profile/${blog.Owner}`)} className={styles.ownerInfo}>
                    <img src={getOwnerAvatar(blog.Owner)} alt="" className={styles.ownerAvatar} />
                    <div className={styles.ownerName}>
                        {getOwnerName(blog?.Owner)}
                    </div>
                </div>

                <div>
                    {blog.Owner === JSON.parse(localStorage.getItem('LoggedInUser'))._id && (
                        <div>
                            <button onClick={() => setEditingBlog(true)} className={styles.button}>Edit</button>
                            <button onClick={handleDeleteBlog} className={styles.button}>Delete</button>
                        </div>
                    )}
                </div>
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
                    <h3>{blog.Title}</h3>
                    <p style={{ maxWidth: "500px", color: "white" }}>{blog.Blog}</p>
                </div>
            )}
            <div className="threebuttons" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

                <div className={styles.actions}>
                    {
                        likes.includes(JSON.parse(localStorage.getItem('LoggedInUser'))._id) ?
                            <button style={{ backgroundColor: "darkred" }} onClick={handleLike} className={styles.button}>  ❤️({likes.length})</button>
                            :
                            <button onClick={handleLike} className={styles.button}>🩶({likes.length})</button>
                    }
                </div>

                <button onClick={() => nav(`/likes/${blog._id}`)} className={styles.button}>ℹ️ 💕</button>

                <button className={styles.button} onClick={() => setShowComments(!showComments)}>ℹ️ 💭</button>

            </div>

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
                                                    onClick={() => handleEditComment(comment._id)}
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
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id, blog._id)}
                                                    className={styles.button}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                }

                <div className={styles.addComment}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className={styles.textarea}
                        placeholder='Add Comment...'
                    />
                    <button onClick={handleAddComment} className={styles.button}>➕ Comment</button>
                </div>
            </div>

        </div>
    );
};

export default BlogCard;
