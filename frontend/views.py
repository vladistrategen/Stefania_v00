from django.shortcuts import redirect, render
from django.views import View

# Create your views here.

# create a home view class

class AuthenticatedView(View):
    # check if the user is authenticated
    def is_authenticated(self, request):
        if not request.user.is_authenticated:
            return False
        return True


class HomeView(AuthenticatedView):
    def get(self, request):
        if self.is_authenticated(request):
            return render(request, 'main_page.html')
        else:
            return redirect('/users/login')
    
    def post(self, request):
        if self.is_authenticated(request):
            return render(request, 'main_page.html')
        else:
            return redirect('/users/login')
        