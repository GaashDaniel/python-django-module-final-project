import SearchResults from "../components/SearchResults";
import "../styles/Home.css";

export default function Home() {
  return (
    <div data-page="home" className="home-container">
      <h1>
        Welcome To <strong>ArticleHub</strong>
      </h1>
      <p>
        ArticleHub is a platform where you can find articles on a variety of
        topics. Whether you're looking for the latest news, in-depth analysis,
        or just some interesting reads, we've got you covered.
      </p>
      <SearchResults />
    </div>
  );
}
