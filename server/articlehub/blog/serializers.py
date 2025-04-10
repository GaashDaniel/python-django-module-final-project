from rest_framework.serializers import ModelSerializer, SerializerMethodField, HiddenField, ReadOnlyField, CurrentUserDefault
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from taggit.serializers import TagListSerializerField, TaggitSerializer
from django.contrib.auth.models import User
from .models import Article, Comment
from django.core.exceptions import ValidationError

class BlogTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['is_editor'] = user.is_staff
        token['is_admin'] = user.is_superuser
        return token

class TagField(TagListSerializerField):
    def to_internal_value(self, value):
        request = self.context.get('request')

        is_browsable_api = (
            request
            and hasattr(request, 'accepted_renderer')
            and request.accepted_renderer.format == 'api'
        )

        if(
            is_browsable_api
            and isinstance(value, list)
            and len(value) == 1
            and isinstance(value[0], str)
        ):
            value = value[0].split()
        
        return super().to_internal_value(value)

class CurrentUserProfileDefault(CurrentUserDefault):
    def __call__(self, *args):
        return super().__call__(*args).username

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': False, 'required': True},
            'id': {'read_only': True},
            'username': {'required': True, 'min_length':3},
        }

    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError('Password must be at least 8 characters long.')
        return value
    
    def validate(self, attrs):
        if attrs['password'] == attrs['username']:
            raise ValidationError('Password must be different from username.')
        return super().validate(attrs)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance:User, validated_data):
        password = validated_data.pop('password', None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.set_password(password)
        instance.save()
        return instance

class ArticleSerializer(TaggitSerializer, ModelSerializer):

    class Meta:
        model = Article
        fields = ['id', 'title', 'content', 'published_at', 'author', 'comments_count', 'tags']
        read_only_fields = ['id', 'published_at']
    
    tags = TagField(style={'base_template': 'textarea.html'})

    comments_count = SerializerMethodField()
    def get_comments_count(self, article):
        return article.comments.count()

    author = SerializerMethodField()
    def get_author(self, article):
        return article.author.username
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

class CommentSerializer(ModelSerializer):
    username = ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'content', 'created_at', 'user', 'username', 'article']
        read_only_fields = ['id', 'created_at', 'user', 'article']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

