from django.shortcuts import render
from django.http import HttpResponse
from . import util
from markdown2 import Markdown

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, entry):
    markdowner = Markdown()
    if util.get_entry(entry):
        return render(request, "encyclopedia/entry.html", {
            "entry": markdowner.convert(util.get_entry(entry)),
            "title": entry
        })
    else:
        return render(request, "encyclopedia/entry.html", {
            "entry": "This entry does not exist."
        })

