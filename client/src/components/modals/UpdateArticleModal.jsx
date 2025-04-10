import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { updateArticle } from "../../services/articleCrud";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UpdateArticleModal({ oldArticle, setOldArticle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const open = location.hash === "#update-article";
  const onClose = () => navigate(`${location.pathname}${location.search}`);

  const [article, setArticle] = useState(oldArticle);

  const removeTag = (tagToRemove) => {
    setArticle({
      ...article,
      tags: article.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  async function handleSubmitUpdate(event) {
    event.preventDefault();
    const [updatedArticle, error] = await updateArticle(article);
    if (error) return toast.error(error.detail);
    onClose();
    setOldArticle(updatedArticle);
    toast.success("Article updated successfully");
  }

  return (
    <Modal open={open} onClose={onClose} className="modal-overlay">
      <Box className="modal">
        <h2>Create new article</h2>
        <form onSubmit={handleSubmitUpdate} className="modal-form">
          <div className="form-group">
            <TextField
              name="title"
              label="title"
              fullWidth
              margin="normal"
              value={article.title}
              onChange={(event) =>
                setArticle({ ...article, title: event.target.value })
              }
              required
            />
            <TextField
              name="content"
              label="content"
              type=""
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={article.content}
              onChange={(event) =>
                setArticle({ ...article, content: event.target.value })
              }
              required
            />
            <TextField
              name="tags"
              label="tags"
              fullWidth
              margin="normal"
              value={article.tags.join(" ")}
              onChange={(event) =>
                setArticle({
                  ...article,
                  tags: event.target.value.split(/[\s,]+/),
                })
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tags-input">
              {article.tags.map((tag, index) => (
                <div key={index} className="tag-item">
                  {tag}
                  <button
                    type="button"
                    className="remove-tag"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit">Update</button>
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </form>
      </Box>
    </Modal>
  );
}
