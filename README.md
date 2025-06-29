<<<<<<< HEAD
# desk
=======
# Vytrini E-commerce

Sistema completo de e-commerce integrado com backend Node.js e MySQL.

## 🚀 Configuração Rápida

### 1. Instalar dependências
\`\`\`bash
npm install
\`\`\`

### 2. Configurar variáveis de ambiente
Crie o arquivo `.env.local`:
\`\`\`env
BACKEND_URL=http://localhost:3002
\`\`\`

### 3. Configurar o backend
- Certifique-se que seu backend Vytrini-back está rodando
- Por padrão, o frontend espera o backend na porta 3002
- Se seu backend estiver na porta 3000, altere no `.env.local`

### 4. Rodar o projeto
\`\`\`bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
\`\`\`

## 🔧 Configuração de Portas

### Opção 1: Frontend na porta 3001
\`\`\`bash
PORT=3001 npm run dev
\`\`\`

### Opção 2: Backend na porta 3002
No seu backend, configure para rodar na porta 3002:
\`\`\`bash
PORT=3002 npm start
\`\`\`

## 📊 Funcionalidades

### Frontend (Cliente)
- ✅ Catálogo de produtos com dados reais do MySQL
- ✅ Carrinho de compras persistente
- ✅ Sistema de favoritos
- ✅ Busca e filtros
- ✅ Página de detalhes do produto
- ✅ Checkout integrado com Mercado Pago

### Painel Administrativo
- ✅ Dashboard com métricas de vendas
- ✅ CRUD completo de produtos
- ✅ Gestão de estoque
- ✅ Relatórios de vendas
- ✅ Autenticação de admin

## 🔗 Integração com Backend

O sistema mapeia automaticamente os campos do backend:
- `nome` → `name`
- `categoria` → `category`
- `preco` → `price`
- `estoque` → `stock`
- `descricao` → `description`
- `imagem` → `image`

## 🛠️ Troubleshooting

### Backend não conecta
1. Verifique se o backend está rodando
2. Confirme a porta no `.env.local`
3. Teste a API: `http://localhost:PORTA/api/products`

### Produtos não aparecem
1. Verifique os logs no console do navegador
2. Teste a rota da API diretamente
3. Confirme se o MySQL está conectado no backend

### Erro de CORS
Configure CORS no seu backend para aceitar requisições do frontend.

## 📱 Acesso

- **Frontend**: http://localhost:3000 (ou 3001)
- **Admin**: http://localhost:3000/admin-vyrtini-secret
- **Credenciais**: admin@vytrini.com / vytrini2024

## 🎯 Próximos Passos

1. Configure o Mercado Pago para checkout real
2. Implemente upload de imagens
3. Adicione mais filtros e categorias
4. Configure notificações de estoque baixo
>>>>>>> 0812b6f (Subindo painel admin da Vytrini)
