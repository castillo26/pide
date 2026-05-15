from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from dotenv import load_dotenv

from .services import consultar_tsirsarp, consultar_lasirsarp, consultar_VDRPVExtra, consultar_vasirsarp,consultar_goficina, consultar_bpjrsocial, consultar_reniec

load_dotenv()


def login_view(request):
    if request.method == 'POST':
        usuario = request.POST.get('usuario', '')
        password = request.POST.get('password', '')

        login_usuario = os.getenv('LOGIN_USUARIO', '')
        login_password = os.getenv('LOGIN_PASSWORD', '')

        if usuario == login_usuario and password == login_password:
            request.session['autenticado'] = True
            return redirect('dashboard')
        else:
            return render(request, 'sunarp/login.html', {'error': 'Usuario o contraseña incorrectos'})

    if request.session.get('autenticado', False):
        return redirect('dashboard')

    return render(request, 'sunarp/login.html')


def logout_view(request):
    request.session.flush()
    return redirect('login')


def consulta_tsirsarp_form(request):
    """
    Muestra el formulario de consulta TSIRSARP
    """
    return render(request, 'sunarp/consulta.html')

def dashboard(request):
    """
    Página principal con enlaces a todas las consultas
    """
    return render(request, 'sunarp/dashboard.html')


def consulta_lasirsarp_form(request):
    """
    Muestra el formulario de consulta LASIRSARP
    """
    return render(request, 'sunarp/consulta_lasirsarp.html')

def consulta_vasirsarp_form(request):
    """
    Muestra el formulario de consulta LASIRSARP
    """
    return render(request, 'sunarp/consulta_vasirsarp.html')

def consulta_vdrpvextra_form(request):
    """
    Muestra el formulario de consulta VDRPVExtra
    """
    return render(request, 'sunarp/consulta_vdrpvextra.html')

def consulta_bpjrsocial_form(request):
    """
    Muestra el formulario de consulta BPJRSocial
    """
    return render(request, 'sunarp/consulta_bpjrsocial.html')

@csrf_exempt
def consultar_vdrpvextra_view(request):
    """
    View para consultar el servicio VDRPVExtra de SUNARP.

    Método: POST
    Body (JSON):
    {
        "usuario": "tu_usuario",
        "clave": "tu_clave",
        "zona": "1",
        "oficina": "1",
        "placa": "ABC123"
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Solo metodo POST"}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "JSON invalido"}, status=400)

    resultado = consultar_VDRPVExtra(
        usuario=data.get("usuario", ""),
        clave=data.get("clave", ""),
        zona=data.get("zona", ""),
        oficina=data.get("oficina", ""),
        placa=data.get("placa", ""),
    )

    return JsonResponse(resultado, safe=False)


@csrf_exempt
def consultar_lasirsarp_view(request):
    """
    View para consultar el servicio LASIRSARP de SUNARP.

    Método: POST
    Body (JSON):
    {
        "usuario": "tu_usuario",
        "clave": "tu_clave",
        "zona": "1",
        "oficina": "1",
        "partida": "12345678",
        "registro": "21000"  // 21000=Propiedad inmueble, 22000=Personas jurídicas, 23000=Personas naturales
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Solo metodo POST"}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "JSON invalido"}, status=400)

    resultado = consultar_lasirsarp(
        usuario=data.get("usuario", ""),
        clave=data.get("clave", ""),
        zona=data.get("zona", ""),
        oficina=data.get("oficina", ""),
        partida=data.get("partida", ""),
        registro=data.get("registro", "")
    )

    return JsonResponse(resultado, safe=False)


@csrf_exempt
def consultar_bpjrsocial_view(request):
    """
    View para consultar el servicio BPJRSocial de SUNARP.

    Método: POST
    Body (JSON):
    {
        "usuario": "tu_usuario",
        "clave": "tu_clave",
        "razon_social": "EMPRESA SAC"
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Solo metodo POST"}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "JSON invalido"}, status=400)

    resultado = consultar_bpjrsocial(
        usuario=data.get("usuario", ""),
        clave=data.get("clave", ""),
        razon_social=data.get("razon_social", "")
    )

    return JsonResponse(resultado, safe=False)


@csrf_exempt
def consultar_tsirsarp_view(request):
    """
    View para consultar el servicio TSIRSARP de SUNARP.

    Método: POST
    Body (JSON):
    {
        "usuario": "tu_usuario",
        "clave": "tu_clave",
        "tipo_participante": "N",  // o "J"
        "apellido_paterno": "APE",  // si es persona natural
        "apellido_materno": "MAT",
        "nombres": "NOMBRE",
        "razon_social": "EMPRESA"  // si es persona jurídica
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Solo metodo POST"}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "JSON invalido"}, status=400)

    resultado = consultar_tsirsarp(
        usuario=data.get("usuario", ""),
        clave=data.get("clave", ""),
        tipo_participante=data.get("tipo_participante", "N"),
        apellido_paterno=data.get("apellido_paterno", ""),
        apellido_materno=data.get("apellido_materno", ""),
        nombres=data.get("nombres", ""),
        razon_social=data.get("razon_social", "")
    )

    return JsonResponse(resultado, safe=False)


@csrf_exempt
def consultar_vasirsarp_view(request):
    """
    View para consultar el servicio VASIRSARP de SUNARP.

    Método: POST
    Body (JSON):
    {
        "transaccion": "...",
        "idImg": "...",
        "tipo": "...",
        "nroTotalPag": "...",
        "nroPagRef": "...",
        "pagina": "..."
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Solo metodo POST"}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "JSON invalido"}, status=400)

    resultado = consultar_vasirsarp(
        usuario=data.get("usuario", ""),
        clave=data.get("clave", ""),
        transaccion=data.get("transaccion", ""),
        idImg=data.get("idImg", ""),
        tipo=data.get("tipo", ""),
        nroTotalPag=data.get("nroTotalPag", ""),
        nroPagRef=data.get("nroPagRef", ""),
        pagina=data.get("pagina", "")
    )

    return JsonResponse(resultado, safe=False)


def consulta_reniec_form(request):
    """
    Muestra el formulario de consulta RENIEC (individual)
    """
    return render(request, 'sunarp/consulta_reniec.html')


def consulta_reniec_masiva_form(request):
    """
    Muestra el formulario de consulta RENIEC masiva (desde Excel)
    """
    return render(request, 'sunarp/consulta_reniec_masiva.html')


@csrf_exempt
def consultar_reniec_view(request):
    """
    View para consultar el servicio RENIEC por DNI.

    Método: POST
    Body (JSON):
    {
        "dni": "12345678"
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Solo metodo POST"}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "JSON invalido"}, status=400)

    resultado = consultar_reniec(
        nu_dni_consulta=data.get("dni", "")
    )

    return JsonResponse(resultado, safe=False)


def consulta_goficina_form(request):
    """
    Muestra el formulario de consulta GOFICINA
    """
    return render(request, 'sunarp/consulta_goficina.html')


@csrf_exempt
def consultar_goficina_view(request):
    """
    View para consultar el servicio GOFICINA de SUNARP.

    Método: POST
    Body (JSON):
    {
        "usuario": "tu_usuario",    // opcional, usa .env si no se envía
        "clave": "tu_clave"         // opcional, usa .env si no se envía
    }
    """
    if request.method != "POST":
        return JsonResponse({"error": "Solo metodo POST"}, status=405)

    try:
        data = json.loads(request.body)
    except:
        return JsonResponse({"error": "JSON invalido"}, status=400)

    resultado = consultar_goficina(
        usuario=data.get("usuario", ""),
        clave=data.get("clave", "")
    )

    return JsonResponse(resultado, safe=False)
