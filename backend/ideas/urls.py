from django.urls import path
from .views import generate_ideas

urlpatterns = [
    path('generate-ideas/', generate_ideas, name='generate-ideas'),
]
