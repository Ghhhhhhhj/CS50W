from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    watchlist = models.ManyToManyField('Listing', related_name="followers")


class Listing(models.Model):
    CATEGORIES = [
        ('none', 'No Category'),
        ('home', 'Home & Garden'),
        ('electronics', 'Electronics'),
        ('fashion', 'Fashion'),
        ('sports', 'Sports & Outdoors'),
        ('toys', 'Toys & Games'),
    ]

    title = models.CharField(max_length=64)
    description = models.TextField(max_length=512)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=15, choices=CATEGORIES, default='none')
    date = models.DateTimeField(auto_now_add=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    image_url = models.URLField(max_length=256, default=None)

class Bid(models.Model):
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bids")
    value = models.DecimalField(max_digits=12, decimal_places=2)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="bids")


class Comment(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name="comments")
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    content = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
