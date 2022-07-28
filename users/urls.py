from django.urls import path
from . import views

urlpatterns=[
    path('login_user/',views.login_view.as_view(),name='login_user'),
]