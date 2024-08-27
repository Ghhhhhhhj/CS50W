from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError, models
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django import forms

from .models import User, Listing


def index(request): 
    listings = Listing.objects.all()
    return render(request, "auctions/index.html", {
        "listings": listings
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return redirect("auctions:index")
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return redirect("auctions:index")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return redirect(reverse("auctions:index"))
    else:
        return render(request, "auctions/register.html")
    

@login_required
def create(request):
    class ListingForm(forms.ModelForm):
        class Meta:
            model = Listing
            fields = ['title', 'description', 'price', 'category', 'image_url']
    if request.method == "POST":
        form = ListingForm(request.POST)
        if form.is_valid():
            listing = form.save(commit=False)
            listing.creator = request.user
            listing.save()
            return redirect("auctions:index")
    form = ListingForm()
    return render(request, "auctions/create.html", {
        "form": form,
    })

@login_required
def listing_view(request, listing_title):

    user = request.user
    listing = get_object_or_404(Listing, title=listing_title)
    watchlisted = listing in user.watchlist.all()

    if request.method == "POST":
        if "watchlisted" in request.POST:
            watchlisted = request.POST["watchlisted"]
            if watchlisted == "True":
                watchlisted = True
                user.watchlist.add(listing)
            elif watchlisted == "False":
                watchlisted = False
                user.watchlist.remove(listing)
    
    return render(request, "auctions/listing.html", {
        "listing": listing,
        "watchlisted": watchlisted
    })


def watchlist(request):
    listings = request.user.watchlist.all()
    return render(request, "auctions/watchlist.html",{
        "listings": listings
    })

    


    
