from django.shortcuts import render, redirect
from . import util
from markdown2 import Markdown
from django import forms

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, entry):
    if util.get_entry(entry):
        markdowner = Markdown()
        return render(request, "encyclopedia/entry.html", {
            "entry": markdowner.convert(util.get_entry(entry)),
            "title": entry
        })
    else:
        return render(request, "encyclopedia/entry.html", {
            "entry": "This entry does not exist.",
            "title": "Error"
        })

def search(request):
    query = request.GET.get("q")
    entry_list = util.list_entries()
    if query.lower() in list(map(str.lower, entry_list)):
        markdowner = Markdown()
        return redirect("encyclopedia:entry", entry=query)
    else:
        search_results = [entry for entry in entry_list if query.lower() in entry.lower()]
        return render(request, "encyclopedia/search.html", {
            "search_results": search_results
        })

def new(request):
    class NewPageForm(forms.Form):
        title = forms.CharField(label="Entry title")
        content = forms.CharField(label="Entry Markdown content", widget=forms.Textarea)
    if request.method == "POST":
        form = NewPageForm(request.POST)
        if form.is_valid():
            entry = form.cleaned_data
            util.save_entry(entry["title"], entry["content"])
            return redirect("encyclopedia:index")
        else:
            return render(request, "encyclopedia/new.html", {
                "form": form
            })
    else:
        return render(request, "encyclopedia/new.html", {
            "form": NewPageForm()
        })