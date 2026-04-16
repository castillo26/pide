import requests
import json
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


def consultar_lasirsarp(
    usuario: str = None,
    clave: str = None,
    zona: str = "",
    oficina: str = "",
    partida: str = "",
    registro: str = ""
):
    """
    Consulta al servicio LASIRSARP de SUNARP para listar asientos.

    Parámetros:
    - usuario: Usuario proporcionado por SUNARP (obligatorio)
    - clave: Password proporcionado por SUNARP (obligatorio)
    - zona: Número de Zona Registral (obligatorio)
    - oficina: Número de Oficina Registral (obligatorio)
    - partida: Número de Partida (obligatorio)
    - registro: Tipo de registro (obligatorio)
        - 21000 = Propiedad inmueble
        - 22000 = Personas jurídicas
        - 23000 = Personas naturales

    Si no se proporcionan usuario y clave, se leen del archivo .env
    """
    # Usar credenciales del .env si no se proporcionan o están vacíos
    if not usuario:
        usuario = os.getenv("SUNARP_USUARIO", "")
    if not clave:
        clave = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/SUNARP/LASIRSARP?out=json"

    # Construir payload
    payload = {
        "PIDE": {
            "usuario": usuario,
            "clave": clave,
            "zona": zona,
            "oficina": oficina,
            "partida": partida,
            "registro": registro
        }
    }

    # Headers
    headers = {
        "Content-Type": "application/json; charset=UTF-8"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)

        resultado = {
            "success": response.status_code == 200,
            "status_code": response.status_code,
            "response": response.text
        }

        # Intentar parsear JSON si viene
        try:
            resultado["data"] = response.json()
        except:
            resultado["data"] = None

        # Si hay error del servidor, extraer mensaje del XML
        if response.status_code != 200:
            import re
            fault_match = re.search(r'<faultstring>(.*?)</faultstring>', response.text)
            if fault_match:
                resultado["error"] = fault_match.group(1)
            else:
                resultado["error"] = f"Error HTTP {response.status_code}"

        return resultado

    except requests.exceptions.Timeout:
        return {"success": False, "error": "Timeout: el servidor tardó demasiado en responder"}
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "Error de conexión: no se pudo contactar al servidor"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def consultar_tsirsarp(
    usuario: str = None,
    clave: str = None,
    tipo_participante: str = "N",
    apellido_paterno: str = "",
    apellido_materno: str = "",
    nombres: str = "",
    razon_social: str = ""
):
    """
    Consulta al servicio TSIRSARP de SUNARP.

    tipo_participante: "N" = Persona Natural, "J" = Persona Jurídica

    Si no se proporcionan usuario y clave, se leen del archivo .env
    """
    # Usar credenciales del .env si no se proporcionan o están vacíos
    if not usuario:
        usuario = os.getenv("SUNARP_USUARIO", "")
    if not clave:
        clave = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/SUNARP/TSIRSARP?out=json"

    # Construir payload
    payload = {
        "PIDE": {
            "usuario": usuario,
            "clave": clave,
            "tipoParticipante": tipo_participante
        }
    }

    # Agregar campos según tipo de persona
    if tipo_participante == "N":
        payload["PIDE"]["apellidoPaterno"] = apellido_paterno
        payload["PIDE"]["apellidoMaterno"] = apellido_materno
        payload["PIDE"]["nombres"] = nombres
    elif tipo_participante == "J":
        payload["PIDE"]["razonSocial"] = razon_social

    # Headers
    headers = {
        "Content-Type": "application/json; charset=UTF-8"
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)

        resultado = {
            "success": response.status_code == 200,
            "status_code": response.status_code,
            "response": response.text
        }

        # Intentar parsear JSON si viene
        try:
            resultado["data"] = response.json()
        except:
            resultado["data"] = None

        # Si hay error del servidor, extraer mensaje del XML
        if response.status_code != 200:
            import re
            fault_match = re.search(r'<faultstring>(.*?)</faultstring>', response.text)
            if fault_match:
                resultado["error"] = fault_match.group(1)
            else:
                resultado["error"] = f"Error HTTP {response.status_code}"

        return resultado

    except requests.exceptions.Timeout:
        return {"success": False, "error": "Timeout: el servidor tardó demasiado en responder"}
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "Error de conexión: no se pudo contactar al servidor"}
    except Exception as e:
        return {"success": False, "error": str(e)}
