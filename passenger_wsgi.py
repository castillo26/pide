import os
import sys

# Ruta del proyecto en cPanel (ajústala según tu hosting)
# Ejemplo: /home/tu_usuario/pide
cwd = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, cwd)

# Agregar el entorno virtual (cPanel lo crea en la raíz del proyecto)
INTERP = os.path.join(cwd, 'env', 'bin', 'python3')
if os.path.exists(INTERP):
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.join(cwd, 'PIDE'))

os.environ['DJANGO_SETTINGS_MODULE'] = 'PIDE.settings'
os.environ['SUNARP_USUARIO'] = os.getenv('SUNARP_USUARIO', '')
os.environ['SUNARP_CLAVE'] = os.getenv('SUNARP_CLAVE', '')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
