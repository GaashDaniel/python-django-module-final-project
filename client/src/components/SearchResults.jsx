import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MUIPagination from "@mui/material/Pagination";
import { getAllArticles } from "../services/articleCrud";
import ArticleCard from "./ArticleCard";
import "../styles/SearchResults.css";
import "../styles/Pagination.css";

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search");
  const currentPage = +searchParams.get("page") || 1;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    count: 0,
    next: null,
    previous: null,
    total_pages: 1,
    results: [],
  });
  const articles = data.results;

  useEffect(() => {
    void (async function fetchAllArticles() {
      const [data] = await getAllArticles(searchQuery, currentPage);
      setData(data);
      setIsLoading(false);
    })();
  }, [searchQuery, currentPage]);

  if (isLoading) {
    return (
      <div className="search-results">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="search-results">
      {articles.length === 0 && (
        <h2 className="no-articles-found"> No articles found</h2>
      )}
      <div className="cards">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
      <MUIPagination
        count={data.total_pages}
        page={currentPage}
        onChange={(event, value) => {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("page", value);
          setSearchParams(newSearchParams);
        }}
      />
    </div>
  );
}
