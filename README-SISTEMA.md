# Ping Presença - Sistema de Chamadas Ânima

Este é um protótipo web para o sistema de chamadas da faculdade do grupo Ânima. O sistema permite que professores gerem códigos de presença e alunos registrem sua presença através desses códigos.

## 🚀 Como executar

```bash
npm install
npm run dev
```

O sistema estará disponível em: http://localhost:5173/

## 👥 Como testar

### Para testar como Professor:
1. Faça login com um email que contenha "professor" (ex: `professor@anima.edu.br`)
2. Use qualquer senha
3. Acesse "Disciplinas" no menu lateral
4. Selecione uma disciplina e uma aula
5. Clique em "Iniciar Chamada" para gerar um código de 6 dígitos
6. O código expira em 30 segundos e pode ser regenerado

### Para testar como Aluno:
1. Faça login com um email que NÃO contenha "professor" (ex: `aluno@anima.edu.br`)
2. Use qualquer senha
3. Acesse "Disciplinas" no menu lateral
4. Digite o código fornecido pelo professor para registrar presença

## 🎨 Funcionalidades

### Dashboard
- Estatísticas de disciplinas, aulas e alunos
- Visão geral das atividades do dia

### Professor
- Gerenciamento de chamadas
- Geração de códigos temporários (30 segundos)
- Visualização de disciplinas e aulas

### Aluno
- Registro de presença via código
- Visualização de disciplinas matriculadas
- Status de chamadas ativas

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework principal
- **TypeScript** - Tipagem estática
- **Zustand** - Gerenciamento de estado
- **Ant Design** - Biblioteca de componentes UI
- **CoreUI** - Componentes adicionais
- **React Router** - Roteamento
- **Vite** - Build tool

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── auth/           # Componentes de autenticação
│   ├── attendance/     # Componentes de chamada
│   └── layout/         # Layout da aplicação
├── pages/              # Páginas da aplicação
│   ├── auth/          # Páginas de autenticação
│   ├── professor/     # Páginas do professor
│   └── student/       # Páginas do aluno
├── store/             # Estados globais (Zustand)
├── types/             # Definições de tipos TypeScript
└── services/          # Serviços de API (futuro)
```

## 🔄 Dados Mockados

Atualmente o sistema utiliza dados simulados para demonstração:

- **Disciplinas**: Programação Web, Algoritmos, Banco de Dados
- **Usuários**: Criados dinamicamente baseado no email de login
- **Aulas**: Geradas automaticamente com datas passadas, hoje e futuras

## 🚧 Próximos Passos

1. Integração com API real do sistema da Ânima
2. Autenticação via SSO institucional
3. Persistência de dados
4. Relatórios de presença
5. Notificações em tempo real
6. Versão mobile (React Native)

## 📱 Design Responsivo

O sistema foi desenvolvido com design responsivo, funcionando bem em:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (até 767px)

## 🎯 Cores e Tema

O sistema utiliza as cores institucionais do grupo Ânima:
- Primária: #1890ff (azul)
- Secundária: #001529 (azul escuro)
- Sucesso: #52c41a (verde)
- Erro: #ff4d4f (vermelho)
- Alerta: #faad14 (amarelo)

## 📧 Contato

Para dúvidas ou sugestões sobre o sistema de chamadas Ping Presença.
