from rest_framework import serializers
from .models import Usuario, Produto, Movimentacao

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nome', 'email', 'senha']

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class MovimentacaoSerializer(serializers.ModelSerializer):
    nome_produto = serializers.ReadOnlyField(source='produto.nome')
    nome_usuario = serializers.ReadOnlyField(source='usuario.nome')

    class Meta:
        model = Movimentacao
        fields = ['id', 'usuario', 'produto', 'tipo', 'quantidade', 'data_movimentacao', 'nome_produto', 'nome_usuario']