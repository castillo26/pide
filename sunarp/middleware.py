from django.shortcuts import redirect
import os
from dotenv import load_dotenv

load_dotenv()


class LoginMiddleware:
    EXEMPT_URLS = ['/sunarp/login/', '/sunarp/logout/']

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path in self.EXEMPT_URLS:
            return self.get_response(request)

        if request.path.startswith('/sunarp/'):
            if not request.session.get('autenticado', False):
                return redirect('login')

        return self.get_response(request)
