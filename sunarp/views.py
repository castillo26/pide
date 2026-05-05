from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .services import consultar_tsirsarp, consultar_lasirsarp, consultar_VDRPVExtra, consultar_vasirsarp, consultar_bpjrsocial


def consulta_tsirsarp_form(request):
    """
    Muestra el formulario de consulta TSIRSARP
    """
    return render(request, 'sunarp/consulta.html')


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
def consultar_vasirsarp_view(request):
    """
    View para consultar el servicio LASIRSARP de SUNARP.

    Método: POST
    Body (JSON):
    {

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
        transacion=data.get("transacion", ""),
        idimg=data.get("idimg", ""),
        tipo=data.get("tipo", ""),
        nrototalpag=data.get("nrototalpag", ""),
        nropagref=data.get("nropagref", ""),
        pagina=data.get("pagina", "")
    )

    return JsonResponse(resultado, safe=False)



def consulta_vasirsarp_form(request):
    """
    Muestra el formulario de consulta VASIRSARP
    """
    return render(request, 'sunarp/consulta_vasirsarp.html')


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


def consulta_goficina_form(request):
    """
    Muestra el formulario de consulta GOFICINA
    """
    return render(request, 'sunarp/consulta_goficina.html')


