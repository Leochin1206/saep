from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    senha = models.CharField(max_length=255)

    class Meta:
        db_table = 'usuarios'  
        managed = True

    def __str__(self):
        return self.nome

    @property
    def is_authenticated(self):
        return True

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.CharField(max_length=255, null=True, blank=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    quantidade = models.IntegerField(default=0)
    quantidade_minima = models.IntegerField(default=5)

    class Meta:
        db_table = 'produtos'
        managed = True

    def __str__(self):
        return self.nome

class Movimentacao(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('saida', 'Saída'),
    ]

    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.IntegerField()
    data_movimentacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'movimentacoes'
        managed = True