import django_filters

class TagFilterSet(django_filters.FilterSet):
    tags = django_filters.CharFilter(method='filter_tags')

    class Meta:
        fields = '__all__'

    def filter_tags(self, queryset, name, value):
        tags = value.split()
        return queryset.filter(tags__name__in=tags).distinct()