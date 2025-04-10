from rest_framework.generics import ListCreateAPIView, DestroyAPIView
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, DjangoModelPermissions, SAFE_METHODS
from core.permissions import IsOwnerOrModelPermissions
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.contrib.auth.models import User
from core.pagination import StandardResultsSetPagination
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken
from core.authentication import get_tokens_for_user
from .filters import ArticlesFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.reverse import reverse
from .serializers import ArticleSerializer, UserSerializer, CommentSerializer
from django.contrib.auth.models import User
from .models import  Article, Comment

class ArticleViewSet(ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer
    permission_classes = [IsOwnerOrModelPermissions]
    filter_backends = [OrderingFilter, DjangoFilterBackend, SearchFilter]
    filterset_class = ArticlesFilter
    search_fields = ['title', 'content', 'author__username', 'tags__name']
    pagination_class = StandardResultsSetPagination

class CommentViewSet(ViewSet, DestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrModelPermissions]

class ArticleCommentsView(ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrModelPermissions]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        article_id = self.kwargs['article_id']
        return Comment.objects.filter(article_id=article_id)

    def perform_create(self, serializer):
        article_id = self.kwargs['article_id']
        serializer.save(article_id=article_id)


class AuthViewSet(ViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @action(detail = False, methods=['post'])
    def register(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        jwt = get_tokens_for_user(user)
        return Response(jwt)
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = AuthTokenSerializer(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        jwt = get_tokens_for_user(user)
        login(request, user)
        return Response({"token": token.key, 'jwt': jwt})

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)
        token = RefreshToken(refresh_token)
        token.blacklist()

        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()

        logout(request)
        return Response({"message": "Logged out successfully"})