from rest_framework import permissions
import rest_framework.decorators
from rest_framework.permissions import BasePermission, DjangoModelPermissions

class IsAdminOrEditor(BasePermission):
    def has_permission(self, request, view):
        is_admin = (
            request.user and
            request.user.is_authenticated and
            request.user.is_superuser
        )
        if is_admin:
            return True
        
        in_editors_group = (
            request.user and
            request.user.is_authenticated and
            request.user.groups.filter(name='editors').exists()
        )
        return in_editors_group
    
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'author'):
            return obj.author.user == request.user
        return False

class IsOwnerOrModelPermissions(DjangoModelPermissions):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if view.get_view_name()=='Article Comments':
            if request.method=='POST' and request.user.is_authenticated:
                return True
        if request.user.is_staff:
            return True
        return super().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if (hasattr(obj, 'author') and obj.author == request.user):
            return True
        if (hasattr(obj, 'user') and obj.user == request.user):
            return True
        if request.user.is_staff:
            return True
        if request.user.groups.filter(name='editors').exists():
            return True
        return False