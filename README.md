# ClinAgenda - Sistema de Gerenciamento de Clínicas

<div align="center">
  <img src="src/assets/logo.svg" alt="ClinAgenda Logo" width="200"/>
  <br/>
  <p><strong>Uma solução completa para gerenciamento de clínicas e consultórios médicos</strong></p>
</div>

## 📋 Sobre o Projeto

ClinAgenda é um sistema web desenvolvido para gerenciar clínicas e consultórios médicos, permitindo o controle de agendamentos, pacientes, profissionais, especialidades e muito mais. O projeto foi desenvolvido utilizando tecnologias modernas como Vue 3, TypeScript e Vuetify 3, garantindo uma interface limpa, responsiva e intuitiva.

## ✨ Funcionalidades

- **Gerenciamento de Agendamentos**: Cadastre, edite e visualize agendamentos de consultas
- **Cadastro de Pacientes**: Mantenha uma base de dados completa dos pacientes
- **Gestão de Profissionais**: Cadastre médicos e associe-os a especialidades
- **Controle de Especialidades**: Gerencie todas as especialidades disponíveis
- **Status Personalizados**: Configure diferentes status para cada entidade do sistema
- **Dashboard**: Visualize informações importantes de forma rápida e intuitiva
- **Autenticação e Autorização**: Sistema seguro com controle de acesso baseado em papéis

## 🚀 Tecnologias Utilizadas

- **Frontend**:
  - Vue 3 (Composition API)
  - TypeScript
  - Vuetify 3
  - Pinia (Gerenciamento de Estado)
  - Vue Router
  - Axios

- **Ferramentas & Padrões**:
  - Vite (Build e Development Server)
  - Date-fns (Manipulação de datas)
  - Maska (Máscaras de input)
  - ESLint & Prettier (Padrões de código)
  - Design Responsivo Mobile-First

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js (versão 16 ou superior)
- Yarn (recomendado) ou NPM

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/clinagenda.git
   cd clinagenda
   ```

2. Instale as dependências:
   ```bash
   yarn install
   # ou
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`
   - Configure a URL da API e outras variáveis necessárias

4. Inicie o servidor de desenvolvimento:
   ```bash
   yarn dev
   # ou
   npm run dev
   ```

5. O aplicativo estará disponível em `http://localhost:3000`

### Build para Produção

```bash
yarn build
# ou
npm run build
```

## 📚 Estrutura do Projeto

```
src/
├── assets/            # Recursos estáticos (imagens, fontes)
├── components/        # Componentes Vue reutilizáveis
├── engine/            # Configurações core (HTTP, Vuetify)
├── enum/              # Enumerações e constantes
├── interfaces/        # Interfaces TypeScript
├── pages/             # Componentes de página organizados por feature
├── router/            # Configuração de rotas
├── stores/            # Stores Pinia (autenticação, toast)
├── styles/            # Estilos globais
├── template/          # Templates de layout
└── utils/             # Funções utilitárias (date, string, mask)
```

## 📱 Screenshots

<div align="center">
  <p><em>Screenshots serão adicionados em breve</em></p>
</div>

## 🔄 Integração com Backend

O ClinAgenda foi projetado para trabalhar com uma API RESTful. A comunicação é feita através do Axios, e todas as requisições são centralizadas no módulo `httpClient.ts`. O sistema inclui:

- Interceptors para tratamento de erros
- Renovação automática de token
- Tratamento padronizado de respostas
- Tipagem forte para requisições e respostas

## 🧪 Testes

```bash
# Executar testes unitários
yarn test

# Executar testes e2e
yarn test:e2e
```

## 👥 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/amazing-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Add some amazing feature'`)
4. Faça push para a branch (`git push origin feature/amazing-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).

## 📞 Contato

- **Email**: seu-email@exemplo.com
- **Website**: [seu-website.com](https://seu-website.com)
- **LinkedIn**: [linkedin.com/in/seu-perfil](https://linkedin.com/in/seu-perfil)

---

<div align="center">
  <p>Desenvolvido com ❤️ como parte do Bootcamp DEVPIRA + PECEGE 2025</p>
</div>
