from django.shortcuts import render, redirect
from django.contrib.auth import authenticate,login,logout
from django.contrib import messages
from django.views import View 

# Create your views here.

class login_view(View):
    def get(self,request):
        return render(request,'login.html')
    def post(self,request):
        username=request.POST.get('username')
        password=request.POST.get('password')
        user=authenticate(request,username=username,password=password)
        if user is not None:
            login(request,user)
            return redirect('/')
        else:
            messages.error(request,'Invalid username or password')
            return redirect('login.html')
