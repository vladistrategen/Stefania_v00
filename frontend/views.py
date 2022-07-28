from django.shortcuts import render
from django.views import View

# Create your views here.

# create a home view class
class HomeView(View):
    def get(self, request):
        return render(request, 'main_page.html')
    
    def post(self, request):
        return render(request, 'main_page.html')