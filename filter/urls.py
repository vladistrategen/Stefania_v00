from django.urls import path
from .views import filter_by_doctor_view, filter_by_date_view

urlpatterns=[
    path("filter_by_doctor/<int:doctor_id>", filter_by_doctor_view.as_view(), name="filter_by_doctor"),
    #path("",filter_by_doctor_view.as_view(), name="filter_by_doctor"),
]