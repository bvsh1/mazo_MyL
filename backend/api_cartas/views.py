from rest_framework import viewsets
from rest_framework.filters import SearchFilter
from .models import Carta
from .serializers import CartaSerializer

class CartaViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CartaSerializer
    filter_backends = [SearchFilter]
    # Permitimos buscar texto en el nombre o en el texto de la habilidad
    search_fields = ['nombre', 'habilidad']

    def get_queryset(self):
        # select_related optimiza la consulta SQL (evita el problema N+1)
        queryset = Carta.objects.select_related('bloque', 'bloque__era').all()
        
        # Filtros manuales para los selectores de tu frontend
        tipo = self.request.query_params.get('tipo')
        raza = self.request.query_params.get('raza')
        bloque = self.request.query_params.get('bloque')
        era = self.request.query_params.get('era')
        coste = self.request.query_params.get('coste')
        edicion = self.request.query_params.get('edicion')

        if tipo:
            queryset = queryset.filter(tipo__iexact=tipo)
        if raza:
            queryset = queryset.filter(raza__iexact=raza)
        if bloque:
            queryset = queryset.filter(bloque__nombre__iexact=bloque)
        if era:
            queryset = queryset.filter(bloque__era__nombre__iexact=era)
        if coste:
            queryset = queryset.filter(coste=coste)
        if edicion:
            queryset = queryset.filter(edicion__iexact=edicion)

        return queryset