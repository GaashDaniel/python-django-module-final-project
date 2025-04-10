import apiFetch from "./apiFetch";

export async function getArticleComments(articleId) {
  return apiFetch(`/api/articles/${articleId}/comments/`, { page_size: 100 });
}

export async function addComment(articleId, content) {
  return apiFetch(
    `/api/articles/${articleId}/comments/`,
    {},
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: content }),
    }
  );
}

export async function deleteComment(commentId) {
  return apiFetch(`/api/comments/${commentId}/`, {}, { method: "DELETE" });
}
