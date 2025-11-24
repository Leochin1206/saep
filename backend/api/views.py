import jwt
import datetime
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Usuario, Produto, Movimentacao
from .serializers import UsuarioSerializer, ProdutoSerializer, MovimentacaoSerializer
from rest_framework.permissions import AllowAny
from django.conf import settings

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.all()
    serializer_class = MovimentacaoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        movimentacao = serializer.save()
        produto = movimentacao.produto
        
        if movimentacao.tipo == 'entrada':
            produto.quantidade += movimentacao.quantidade
        elif movimentacao.tipo == 'saida':
            if produto.quantidade < movimentacao.quantidade:
                movimentacao.delete()
                return Response({"erro": "Estoque insuficiente"}, status=400)
            produto.quantidade -= movimentacao.quantidade
            
        produto.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny]) 
def login_view(request):
    email = request.data.get('email')
    senha = request.data.get('senha')

    try:
        usuario = Usuario.objects.get(email=email, senha=senha)

        payload = {
            'user_id': usuario.id,
            'nome': usuario.nome,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24) 
        }
        
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        return Response({
            "message": "Login realizado com sucesso",
            "token": token,
            "user": {
                "id": usuario.id,
                "nome": usuario.nome,
                "email": usuario.email
            }
        }, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        return Response({"error": "Email ou senha inválidos"}, status=status.HTTP_401_UNAUTHORIZED)