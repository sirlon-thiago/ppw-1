## 🔐 POST /api/login

Endpoint utilizado para simular o processo de autenticação do usuário.

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/login
```

> **IMPORTANTE:** Métodos diferentes de POST retornarão um erro 'Método não permitido'

---

### 📥 Requisição

A requisição deve enviar um **JSON** no corpo (`body`) com os seguintes campos:

| Campo     | Tipo     | Obrigatório | Descrição                       |
|-----------|-----------|-------------|---------------------------------|
| `email`   | string    | ✔️          | E-mail do usuário               |
| `senha`| string    | ✔️          | Senha do usuário                |

#### 🧪 Exemplo de body:
```json
{
  "email": "joao@example.com",
  "senha": "123456"
}
```

---

### 📤 Respostas

#### ✔️ **200 OK — Login efetuado**
Retorna quando o usuário envia qualquer combinação de e-mail e senha **exceto** `admin/admin`.

```json
{
  "success": true,
  "message": "Login realizado com sucesso!"
}
```

---

#### ❌ **401 Unauthorized — Credenciais inválidas**
Retorna quando:

- `email` = `"admin"`
- `senha` = `"admin"`

```json
{
  "success": false,
  "message": "Usuário ou senha inválidos."
}
```

---

- O front-end pode salvar o login usando `localStorage` ou `sessionStorage`.

---

## 📌 POST /api/register

Cria um novo usuário fictício.  

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/register
```

---

### 🧾 **Parâmetros esperados (body JSON)**

```json
{
  "nome": "Nome completo do usuário",
  "email": "usuario@example.com",
  "senha": "senha123",
  "confirmacaoSenha": "senha123"
}
```

---

### ✔️ **Validações**

O endpoint verifica:

1. **Se o nome foi informado**
2. **Se o e-mail tem formato válido**
3. **Se a senha foi informada**
4. **Se a senha e a confirmação de senha são idênticas**

---

### 🟢 **Resposta de sucesso**

```json
{
  "success": true,
  "message": "Usuário registrado com sucesso!"
}
```

---

### 🔴 **Respostas de erro**

#### ❌ E-mail inválido
```json
{
  "success": false,
  "message": "E-mail inválido."
}
```

#### ❌ Senhas não conferem
```json
{
  "success": false,
  "message": "As senhas não são idênticas."
}
```

#### ❌ Campos obrigatórios faltando
```json
{
  "success": false,
  "message": "Preencha todos os campos obrigatórios."
}
```

---

## 📦 POST /api/frete

Calcula opções de frete a partir de um CEP informado.  
Os valores retornados são fictícios e variam aleatoriamente entre **50.00** e **150.00**.

### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/frete
```

---

### 📥 **Parâmetros (Body JSON)**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `cep` | string | Sim | CEP no formato `99999-999` |

---

### ✔️ **Validações**

- O campo `cep` **deve estar no formato válido** `99999-999`.
- Caso o CEP seja inválido, retorna erro.

---

### 📤 **Resposta — Sucesso (200)**

```json
{
  "sucesso": true,
  "fretes": [
    {
      "servico": "Correios - PAC",
      "valor": 73.42,
      "prazo": "5 a 10 dias úteis"
    },
    {
      "servico": "Correios - Sedex",
      "valor": 128.99,
      "prazo": "2 a 4 dias úteis"
    },
    {
      "servico": "Transportadora XPTO",
      "valor": 91.10,
      "prazo": "3 a 7 dias úteis"
    }
  ]
}
```

### ❌ Resposta — Erro (400)

```json
{
  "success": false,
  "message": "CEP inválido. Formato esperado: 99999-999"
}
```

---

## 📦 GET /api/products

Retorna uma lista de **10 produtos fictícios**, cada um contendo:

- ID único incremental (1 a 10)
- Nome fictício
- Preço aleatório entre R$ 50,00 e R$ 500,00
- Descrição gerada com *Lorem Ipsum*
- Imagem aleatória vinda do Picsum (https://picsum.photos)


### 📌 URL
```
POST https://ppw-1-tads.vercel.app/api/products
```

---

### 🔹 **Resposta de Sucesso (200)**

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "Produto Exemplo",
      "price": 123.45,
      "description": "Lorem ipsum dolor sit amet...",
      "image": "https://picsum.photos/seed/1/300/200"
    }
  ]
}
```

---

### 🔹 **Formato dos Dados**

| Campo        | Tipo     | Descrição                                                        |
|--------------|----------|------------------------------------------------------------------|
| `id`         | number   | Identificador único incremental                                   |
| `name`       | string   | Nome fictício do produto                                         |
| `price`      | number   | Preço aleatório entre 50 e 500                                    |
| `description`| string   | Texto lorem ipsum para compor a descrição                         |
| `image`      | string   | URL de imagem aleatória do Picsum                                 |

---

### 🔹 **Notas**
- As imagens sempre mudarão porque usam seeds diferentes.
- Os nomes dos produtos são gerados dinamicamente.
- O endpoint não exige parâmetros.
- A lista contém sempre **exatamente 10 itens**.

---

## 🔹 **Exemplo de Resposta Real**

```json
{
  "success": true,
  "products": [
    {
      "id": 1,
      "name": "UltraSoft Comfort Seat",
      "price": 312.77,
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      "image": "https://picsum.photos/seed/1/300/200"
    },
    {
      "id": 2,
      "name": "PrimeTech Wireless Controller",
      "price": 98.12,
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      "image": "https://picsum.photos/seed/2/300/200"
    }
  ]
}
```

---

## 🧩 PUT /api/user ou PATCH /api/user

Atualiza informações básicas do usuário (nome e e-mail).  
Realiza validação simples do e-mail antes de confirmar a atualização.

---

### 📌 URL
```
PUT https://ppw-1-tads.vercel.app/api/user
PATCH https://ppw-1-tads.vercel.app/api/user
```

---

### 📥 Corpo da Requisição (JSON)

```json
{
  "nome": "João da Silva",
  "email": "joao@example.com"
}
```

### 🔎 Regras de Validação

- nome: obrigatório
- email: obrigatório e deve estar em um formato válido (algo@dominio.com)

---

### 📤 Respostas

#### ✅ Sucesso (200)

```json
{
"sucesso": true,
"mensagem": "Dados alterados com sucesso"
}
```

---

#### ❌ Falha na Validação (400)
```json
{
"sucesso": false,
"mensagem": "E-mail inválido"
}
```
