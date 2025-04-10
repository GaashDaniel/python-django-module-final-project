import { useNavigate, useParams } from "react-router-dom";
import { deleteArticle, getArticleById } from "../services/articleCrud";
import { useState, useEffect } from "react";
import {
  getArticleComments,
  addComment,
  deleteComment,
} from "../services/commentCrud";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPencil } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";
import UpdateArticleModal from "../components/modals/UpdateArticleModal";
import "../styles/Article.css";

export default function Article({ user }) {
  const { articleId } = useParams();
  const [article, setArticle] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getArticleById(articleId).then(([data]) => setArticle(data));
    getArticleComments(articleId).then(([data]) => setComments(data.results));
    setIsLoading(false);
  }, [articleId]);

  async function handleSubmitNewComment(event) {
    event.preventDefault();
    if (!user) return navigate("#login");
    const [data, error] = await addComment(articleId, newComment);
    if (error) return toast.error(error.detail);
    setComments([...comments, data]);
    setNewComment("");
    toast.success("comment submitted");
  }

  async function handleDeleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this content?")) return;
    const [data, error] = await deleteComment(commentId);
    if (error) return toast.error(error.detail);
    const newComments = comments.filter((comment) => comment.id !== commentId);
    setComments(newComments);
    toast.success("Comment deleted successfully");
  }

  async function handleDeleteArticle(articleId) {
    if (!confirm("Are you sure you want to delete this content?")) return;
    const [data, error] = await deleteArticle(articleId);
    if (error) return toast.error(error.detail);
    navigate("/");
    toast.success("Article deleted successfully");
  }

  const handleTagClick = (tag) => {
    navigate(`/?search=${tag}`);
  };

  if (isLoading) {
    return (
      <div className="search-results">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div data-page="article">
      {article ? (
        <>
          <div className="article">
            <div className="actions">
              {(user?.username === article.author || user?.is_admin) && (
                <>
                  <IconButton
                    aria-label="delete"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteArticle(article.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} fontSize="0.75em" />
                  </IconButton>
                  <IconButton
                    aria-label="update"
                    color="primary"
                    size="small"
                    onClick={() => navigate("#update-article")}
                  >
                    <FontAwesomeIcon icon={faPencil} fontSize="0.75em" />
                  </IconButton>
                </>
              )}
            </div>
            <h2>{article.title}</h2>
            <div className="meta">
              By <span>{article.author} </span>
              at <span>{article.published_at.slice(0, 10)}</span>
            </div>
            <p>{article.content}</p>
            {article.tags && article.tags.length > 0 && (
              <div className="tags">
                {article.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="tag"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="comments">
            <h2>Comments</h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-meta">
                    By <span>{comment.username} </span>
                    at <span>{comment.created_at.slice(0, 10)}</span>
                  </div>
                  {user?.is_admin && (
                    <IconButton
                      aria-label="delete"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} fontSize="0.75em" />
                    </IconButton>
                  )}
                  <p>{comment.content}</p>
                </div>
              ))
            ) : (
              <p>No comments yet</p>
            )}
            <h2>Add a comment</h2>
            <form className="comment-form" onSubmit={handleSubmitNewComment}>
              <label htmlFor="comment">Comment:</label>
              <textarea
                id="comment"
                name="comment"
                placeholder="Write your comment here..."
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                required
              ></textarea>
              <button type="submit">Submit</button>
            </form>
          </div>
          <UpdateArticleModal oldArticle={article} setOldArticle={setArticle} />
        </>
      ) : (
        <h2 className="no-articles-found">No article found</h2>
      )}
    </div>
  );
}
