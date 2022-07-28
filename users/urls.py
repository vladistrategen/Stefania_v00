from django.urls import path
from . import views

urlpatterns=[
    path('login/',views.login_view.as_view(),name='login'),
]