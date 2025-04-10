import { Link, useSearchParams, useNavigate } from "react-router-dom";
import "../styles/ArticleCard.css";

export default function ArticleCard({ article }) {
  let { content } = article;
  const tooLong = content.length > 300;
  if (tooLong) content = content.slice(0, 300) + "... (read more!)";

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("search", tag);
    setSearchParams(newSearchParams);
    if (window.location.pathname !== "/") {
      navigate(`/?search=${tag}`);
    }
  };

  return (
    <div className="article-card">
      <div className="details">
        <h2>{article.title}</h2>
        <div className="article-meta">
          <span>Author: {article.author}</span>
          <span>Published: {article.published_at.slice(0, 10)}</span>
        </div>
        <p className="article-preview">{content}</p>

        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
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

        <div className="actions">
          <div></div>
          <Link to={`/article/${article.id}`} className="read-more-btn">
            Read Full Article
          </Link>
        </div>
      </div>
    </div>
  );
}
