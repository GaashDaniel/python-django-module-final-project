from rest_framework.authtoken import views as auth_views
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, AuthViewSet, CommentViewSet, ArticleCommentsView

router = DefaultRouter()

router.register('articles', ArticleViewSet, basename='articles')
router.register('comments', CommentViewSet, basename='comments')
router.register('', AuthViewSet, basename='auth')


urlpatterns = [
    path('', include(router.urls)),
    path('articles/<int:article_id>/comments/', ArticleCommentsView.as_view(), name='article-comments'),
    path('api-auth/', include('rest_framework.urls')),
    path('login/', auth_views.obtain_auth_token),
]