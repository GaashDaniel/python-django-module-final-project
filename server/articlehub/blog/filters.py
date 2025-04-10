from core.filters import TagFilterSet
from .models import Article

class ArticlesFilter(TagFilterSet):
    class Meta:
        model = Article
        fields = ['title', 'content', 'author', 'tags']