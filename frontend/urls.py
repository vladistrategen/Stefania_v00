from django.urls import include, path
#from api import views
from .views import index
#from homepage import views as homepage_views

urlpatterns=[
    path("",index)
]