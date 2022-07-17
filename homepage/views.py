from tkinter import EW
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def homepage_view(request):
    context={}
    return render(request, 'index.html',context)