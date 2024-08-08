def goodbye(func):
    def wrapper(*args, **kwargs):
        func(*args, **kwargs)
        print("Goodbye!")
    return wrapper

@goodbye
def hello(name):
    print(f"Hello, {name}")

hello("David")
