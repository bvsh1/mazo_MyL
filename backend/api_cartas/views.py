from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from django.db.models import Q
from .models import Carta
from .serializers import CartaSerializer

class CartaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CartaSerializer
    filter_backends = [SearchFilter]
    search_fields = ['nombre', 'habilidad']

    def get_queryset(self):
        queryset = Carta.objects.select_related('bloque', 'bloque__era').all()
        
        tipo = self.request.query_params.get('tipo')
        raza = self.request.query_params.get('raza')
        bloque = self.request.query_params.get('bloque')
        era = self.request.query_params.get('era')
        coste = self.request.query_params.get('coste')
        edicion = self.request.query_params.get('edicion')
        subtipoOro = self.request.query_params.get('subtipoOro')

        if tipo:
            queryset = queryset.filter(tipo__iexact=tipo)
        if raza:
            queryset = queryset.filter(raza__iexact=raza)
        if coste:
            queryset = queryset.filter(coste=coste)
            
        # Limpieza de texto: reemplazamos guiones por espacios
        if bloque:
            queryset = queryset.filter(bloque__nombre__iexact=bloque.replace("-", " "))
        if era:
            queryset = queryset.filter(bloque__era__nombre__iexact=era.replace("-", " "))
        if edicion:
            queryset = queryset.filter(edicion__iexact=edicion.replace("-", " "))

        # Filtro de Oros (sin habilidad vs con habilidad)
        if tipo == 'Oro' and subtipoOro:
            if subtipoOro == 'basico':
                queryset = queryset.filter(Q(habilidad__isnull=True) | Q(habilidad__exact=''))
            elif subtipoOro == 'habilidad':
                queryset = queryset.exclude(Q(habilidad__isnull=True) | Q(habilidad__exact=''))
            elif subtipoOro == 'inicial':
                queryset = queryset.filter(nombre__icontains='Inicial')

        return queryset