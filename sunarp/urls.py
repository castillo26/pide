from django.urls import path
from . import views

urlpatterns = [
    path('tsirsarp/', views.consultar_tsirsarp_view, name='consultar_tsirsarp'),
    path('consulta/', views.consulta_tsirsarp_form, name='consulta_tsirsarp_form'),
    path('lasirsarp/', views.consultar_lasirsarp_view, name='consultar_lasirsarp'),
    path('consulta-lasirsarp/', views.consulta_lasirsarp_form, name='consulta_lasirsarp_form'),
    path('vasirsarp/', views.consultar_vasirsarp_view, name='consultar_vasirsarp'),
    path('consulta-vasirsarp/', views.consulta_vasirsarp_form, name='consulta_vasirsarp_form'),
    path('goficina/', views.consultar_goficina_view, name='consultar_goficina'),
    path('consulta-goficina/', views.consulta_goficina_form, name='consulta_goficina_form'),
]
