import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div data-page="page-not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link className="" to={"/"}>
        Return Home
      </Link>
    </div>
  );
}

export default PageNotFound;
