from django.urls import path

from . import views

app_name = "auctions"
urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register, name="register"),
    path("create/", views.create, name="create"),
    path("watchlist/", views.watchlist, name="watchlist"),
    path("categories/", views.categories, name="categories"),
    path("categories/<str:category>", views.category_listings, name="category_listings"),
    path("closed/<str:listing_title>/", views.closed, name="closed"),
    path("<str:listing_title>/", views.listing_view, name="listing_view")
]
