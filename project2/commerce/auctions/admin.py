from django.contrib import admin
from .models import Listing, Bid, Comment
from django.contrib.auth import get_user_model

admin.site.register(Listing)
admin.site.register(Bid)
admin.site.register(Comment)
admin.site.register(get_user_model())
