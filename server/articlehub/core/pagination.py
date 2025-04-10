from rest_framework.pagination import PageNumberPagination
import math

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 3
    max_page_size = 100
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        response = super().get_paginated_response(data)
        results = response.data.pop('results')
        total_pages = math.ceil(self.page.paginator.count / self.page_size)
        response.data['total_pages'] = total_pages
        response.data['results'] = results
        return response