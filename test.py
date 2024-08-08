def goodbye(f):
    def wrapper():
        f()
        print("Goodbye!")
    return wrapper

@goodbye
def hello():
    print("Hello, world!")

hello()
