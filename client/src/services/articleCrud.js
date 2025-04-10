import apiFetch from "./apiFetch";

export function getAllArticles(search, page) {
  return apiFetch("/api/articles/", { search, page });
}

export function getArticleById(id) {
  return apiFetch(`/api/articles/${id}/`);
}
// TODO: check all functions below
export async function createNewArticle(rawArticle) {
  return apiFetch(
    "/api/articles/",
    {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rawArticle),
    }
  );

  // try {
  //   const response = await fetch("/api/articles/", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //     body: JSON.stringify(rawArticle),
  //   });
  //   if (!response.ok) {
  //     const error = await response.text();
  //     return { error, article: null };
  //   }
  //   const article = await response.json();
  //   return { article, error: null };
  // } catch (error) {
  //   console.error(error);
  //   return { error: error, article: null };
  // }
}

export async function updateArticle(updatedArticle) {
  return apiFetch(
    `/api/articles/${updatedArticle.id}/`,
    {},
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedArticle),
    }
  );

  // try {
  //   const response = await fetch(`/api/articles/${articleId}/`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //     body: JSON.stringify(updatedArticle),
  //   });
  //   if (!response.ok) {
  //     const error = await response.text();
  //     return { error, article: null };
  //   }
  //   const article = await response.json();
  //   return { article, error: null };
  // } catch (error) {
  //   console.error(error);
  //   return { error: error, article: null };
  // }
}

export async function deleteArticle(articleId) {
  return apiFetch(`/api/articles/${articleId}/`, {}, { method: "DELETE" });

  // try {
  //   const response = await fetch(`/api/articles/${articleId}/`, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //     },
  //   });
  //   if (!response.ok) {
  //     const error = await response.text();
  //     return { error, success: false };
  //   }
  //   return { success: true, error: null };
  // } catch (error) {
  //   console.error(error);
  //   return { error: error, success: false };
  // }
}
