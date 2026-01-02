# 🚀 FreelaVault - Marketplace de Códigos

<img width="1919" height="941" alt="Screenshot 2026-01-02 115659" src="https://github.com/user-attachments/assets/c9b2f2fd-1fbd-4b3a-9892-7c0112f05b74" />

O FreelaVault é uma plataforma completa para desenvolvedores venderem e comprarem projetos de código-fonte de forma segura. O sistema conta com gestão de arquivos, pagamentos automatizados e avaliações reais.

🔗 Link do Projeto
(https://freelavault.vercel.app/)

🛠️ Tecnologias Utilizadas
Framework: Next.js 

Linguagem: TypeScript

Banco de Dados: PostgreSQL (via Prisma ORM)

Pagamentos: Stripe API (Checkout e Webhooks)

Autenticação: NextAuth.js

Armazenamento de Arquivos: Vercel Blob

Estilização: Tailwind CSS e Lucide Icons

🌟 Principais Funcionalidades
Sistema de Vendas: Upload de arquivos (.zip) e imagens de capa com limites de tamanho validados no servidor.

Checkout Seguro: Integração com Stripe para processamento de pagamentos.

Área do Comprador: Página "Minhas Compras" com acesso imediato ao download após aprovação.

Painel do Vendedor: Gestão de produtos, permitindo editar descrições, preços e substituir arquivos.

Avaliações Inteligentes: Sistema de reviews que permite comentários apenas para usuários que realmente adquiriram o produto.

Segurança de Dados: Deleção em cascata (se o vendedor sai, o produto sai da loja, mas o comprador mantém o acesso).

🚀 Como rodar o projeto localmente
Clone o repositório

Instale as dependências: npm install

Configure as variáveis de ambiente no arquivo .env (Stripe, Database, NextAuth).

Sincronize o banco de dados: npx prisma db push

Inicie o servidor: npm run dev
