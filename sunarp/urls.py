from django.urls import path
from . import views

urlpatterns = [
    path('tsirsarp/', views.consultar_tsirsarp_view, name='consultar_tsirsarp'),
    path('consulta/', views.consulta_tsirsarp_form, name='consulta_tsirsarp_form'),
]
