# Ateliê Art Presente — Site + CMS

Site estático com Decap CMS. Conteúdo gerenciado pelo painel em `/admin`.

---

## 🚀 Como colocar no ar (passo a passo)

### 1. Criar repositório no GitHub
1. Acesse [github.com](https://github.com) → **New repository**
2. Nome: `artpresente` (ou qualquer nome)
3. Visibilidade: **Public** (necessário para o Netlify gratuito)
4. Clique em **Create repository**
5. Faça upload de todos os arquivos deste projeto

### 2. Hospedar no Netlify
1. Acesse [netlify.com](https://netlify.com) → **Sign up** (gratuito)
2. Clique em **Add new site → Import an existing project**
3. Escolha **GitHub** e autorize
4. Selecione o repositório `artpresente`
5. Build settings: deixe tudo em branco (site estático)
6. Clique em **Deploy site**
7. O Netlify vai gerar uma URL tipo `artpresente-abc123.netlify.app`

### 3. Ativar o CMS (Decap CMS)
1. No painel do Netlify → **Site settings → Identity**
2. Clique em **Enable Identity**
3. Em **Registration preferences** → selecione **Invite only**
4. Em **Services → Git Gateway** → clique **Enable Git Gateway**

### 4. Convidar Helena (e Ana) como editoras
1. Netlify → **Identity → Invite users**
2. Digite o e-mail de Helena e o de Ana
3. Elas receberão um e-mail para criar senha
4. Para entrar no painel: `seusite.netlify.app/admin`

### 5. Domínio personalizado (opcional)
1. Netlify → **Domain settings → Add custom domain**
2. Ex: `artpresente.com.br`
3. Siga as instruções para apontar o DNS

---

## ✏️ Como usar o painel (CMS)

Acesse: `seusite.netlify.app/admin`

### Cadastrar uma peça nova
1. Clique em **Peças → New Peça**
2. Preencha: nome, categoria, preço, técnica, tamanho, descrição
3. **Fotos**: clique em **Add item** para adicionar quantas quiser
4. Marque **Disponível para venda** se quiser mostrar o botão de compra
5. Marque **Destaque** para aparecer em destaque na página inicial
6. Clique em **Publish** → o site atualiza automaticamente em ~1 minuto

### Editar ou excluir uma peça
1. Painel → **Peças** → clique na peça
2. Edite os campos desejados → **Save**
3. Para excluir: botão **Delete** no canto superior

### Escrever um post no blog
1. Painel → **Blog → New Post**
2. Preencha título, resumo, foto de capa, categoria
3. Escreva o conteúdo no editor (aceita formatação como **negrito**, _itálico_, subtítulos)
4. Clique em **Publish**

---

## 📁 Estrutura de arquivos

```
artpresente/
├── index.html          ← Página principal
├── sobre.html          ← Página "A história"
├── netlify.toml        ← Configuração Netlify
├── css/
│   └── style.css       ← Todo o design
├── js/
│   └── main.js         ← Toda a interatividade
├── admin/
│   ├── index.html      ← Painel CMS
│   └── config.yml      ← Configuração do CMS
├── _products/          ← JSONs das peças (criados pelo CMS)
├── _posts/             ← JSONs dos posts (criados pelo CMS)
└── images/
    └── uploads/        ← Fotos enviadas pelo CMS
```

---

## 🖼️ Adicionar foto da Helena

No `index.html`, localize:
```html
<div class="sobre-visual-placeholder">H</div>
```
Substitua por:
```html
<img src="images/helena.jpg" alt="Helena de Queiroz">
```

---

## 📞 Suporte

Em caso de dúvidas sobre o site, entre em contato com quem desenvolveu.
