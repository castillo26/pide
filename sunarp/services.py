import requests
import json
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


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
    # Usar credenciales del .env si no se proporcionan
    if usuario is None:
        usuario = os.getenv("SUNARP_USUARIO", "")
    if clave is None:
        clave = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/SUNARP/TSIRSARP"

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

        return resultado

    except requests.exceptions.Timeout:
        return {"success": False, "error": "Timeout"}
    except requests.exceptions.ConnectionError:
        return {"success": False, "error": "Error de conexion"}
    except Exception as e:
        return {"success": False, "error": str(e)}
