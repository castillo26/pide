import requests
import json
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()


def consultar_VDRPVExtra(
    usuario: str = None,
    clave: str = None,
    zona: str = "",
    oficina: str = "",
    placa: str = "",
    

):
    """
    Consulta al servicio VDRPVExtra de SUNARP para datos de vehículo por placa. 
  

    Si no se proporcionan usuario y clave, se leen del archivo .env
    """
    # Usar credenciales del .env si no se proporcionan o están vacíos
    if not usuario:
        usuario = os.getenv("SUNARP_USUARIO", "")
    if not clave:
        clave = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/SUNARP/VDRPVExtra?out=json"

    # Construir payload
    payload = {
        "PIDE": {
            "usuario": usuario,
            "clave": clave,
            "zona": zona,
            "oficina": oficina,
            "placa": placa,

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


def consultar_vasirsarp(
    usuario: str = None,
    clave: str = None,
    transaccion: str = "",
    idImg: str = "",
    tipo: str = "",
    nroTotalPag: str = "",
    nroPagRef: str = "",
    pagina: str = ""
):
    """
    Consulta al servicio VASIRSARP de SUNARP para visualizar una imagen.
    """
    if not usuario:
        usuario = os.getenv("SUNARP_USUARIO", "")
    if not clave:
        clave = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/SUNARP/VASIRSARP?out=json"

    payload = {
        "PIDE": {
            "usuario": usuario,
            "clave": clave,
            "transaccion": transaccion,
            "idImg": idImg,
            "tipo": tipo,
            "nroTotalPag": nroTotalPag,
            "nroPagRef": nroPagRef,
            "pagina": pagina
        }
    }

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

        try:
            resultado["data"] = response.json()
        except:
            resultado["data"] = None

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


def consultar_tsirsarp(usuario: str = None,clave: str = None,tipo_participante: str = "N",apellido_paterno: str = "", apellido_materno: str = "",
    nombres: str = "",razon_social: str = ""
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


def consultar_bpjrsocial(
    usuario: str = None,
    clave: str = None,
    razon_social: str = ""
):
    """
    Consulta al servicio BPJRSocial de SUNARP para buscar persona jurídica por razón social.

    Parámetros:
    - usuario: Usuario proporcionado por SUNARP (obligatorio)
    - clave: Password proporcionado por SUNARP (obligatorio)
    - razon_social: Nombre de la Razón Social a buscar (obligatorio)

    Retorna datos: zona, oficina, partida, ficha, tomo, folio, tipo, denominacion

    Si no se proporcionan usuario y clave, se leen del archivo .env
    """
    if not usuario:
        usuario = os.getenv("SUNARP_USUARIO", "")
    if not clave:
        clave = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/SUNARP/BPJRSocial?out=json"

    payload = {
        "PIDE": {
            "usuario": usuario,
            "clave": clave,
            "razonSocial": razon_social
        }
    }

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

        try:
            resultado["data"] = response.json()
        except:
            resultado["data"] = None

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


def consultar_reniec(
    nu_dni_consulta: str = "",
    nu_dni_usuario: str = None,
    nu_ruc_usuario: str = None,
    password: str = None
):
    """
    Consulta al servicio RENIEC para obtener datos de una persona por DNI.

    URL: https://ws2.pide.gob.pe/Rest/RENIEC/Consultar

    Parámetros:
    - nu_dni_consulta: Número de DNI a consultar (obligatorio)
    - nu_dni_usuario: Usuario DNI proporcionado por RENIEC (opcional, usa .env)
    - nu_ruc_usuario: RUC de usuario proporcionado por RENIEC (opcional, usa .env)
    - password: Password proporcionado por RENIEC (opcional, usa .env)
    """
    if not nu_dni_usuario:
        nu_dni_usuario = os.getenv("SUNARP_DNI_USUARIO", "")
    if not nu_ruc_usuario:
        nu_ruc_usuario = os.getenv("SUNARP_RUC_USUARIO", "")
    if not password:
        password = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/RENIEC/Consultar"

    params = {
        "nuDniConsulta": nu_dni_consulta,
        "nuDniUsuario": nu_dni_usuario,
        "nuRucUsuario": nu_ruc_usuario,
        "password": password,
        "out": "json"
    }

    try:
        response = requests.get(url, params=params, timeout=30)

        resultado = {
            "success": response.status_code == 200,
            "status_code": response.status_code,
            "response": response.text
        }

        if response.status_code == 200:
            try:
                resultado["data"] = response.json()
            except:
                resultado["data"] = None
        else:
            resultado["data"] = None
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


def consultar_goficina(
    usuario: str = None,
    clave: str = None
):
    """
    Consulta al servicio GOOFICINA de SUNARP para obtener la lista de oficinas registrales.

    Parámetros:
    - usuario: Usuario proporcionado por SUNARP (obligatorio)
    - clave: Password proporcionado por SUNARP (obligatorio)

    Retorna:
    - codZona: Código de zona registral
    - codOficina: Código de oficina registral
    - descripcion: Nombre de la oficina registral
    """
    if not usuario:
        usuario = os.getenv("SUNARP_USUARIO", "")
    if not clave:
        clave = os.getenv("SUNARP_CLAVE", "")

    url = "https://ws2.pide.gob.pe/Rest/SUNARP/GOficina"

    params = {
        "usuario": usuario,
        "clave": clave,
        "out": "json"
    }

    try:
        response = requests.get(url, params=params, timeout=30)

        resultado = {
            "success": response.status_code == 200,
            "status_code": response.status_code,
            "response": response.text
        }

        if response.status_code == 200:
            try:
                json_data = response.json()
                # Desanidar: la API devuelve {"oficina":{"oficina":[...]}}
                if isinstance(json_data, dict) and "oficina" in json_data:
                    oficinas = json_data["oficina"]
                    if isinstance(oficinas, dict) and "oficina" in oficinas:
                        resultado["data"] = oficinas["oficina"]
                    else:
                        resultado["data"] = oficinas
                else:
                    resultado["data"] = json_data
            except:
                resultado["data"] = None
        else:
            resultado["data"] = None
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
