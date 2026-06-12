# API REST – Express + MongoDB + JWT

Backend desarrollado con **Node.js**, **Express** y **MongoDB** que implementa autenticación JWT y gestión de productos siguiendo la arquitectura **MVC**.

---

## Tecnologías

- Node.js (ES Modules)
- Express 5
- MongoDB + Mongoose
- JSON Web Token (JWT)
- bcryptjs
- express-rate-limit
- CORS
- dotenv

---

## Estructura del proyecto

```
src/
├── config/
│   └── mongoDbConnection.js   # Conexión a MongoDB
├── controllers/
│   ├── authControllers.js     # Lógica de registro y login
│   └── productControllers.js  # CRUD de productos
├── middlewares/
│   ├── authMiddleware.js      # Verificación de token JWT
│   └── limiterMiddleware.js   # Rate limiting para login
├── models/
│   ├── UserModel.js           # Schema de usuario
│   └── ProductModel.js        # Schema de producto
├── routes/
│   ├── authRouter.js          # Rutas públicas de autenticación
│   └── productRouter.js       # Rutas privadas de productos
└── app.js                     # Servidor principal
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Api_MongoDb_Express
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz basándose en `.env.example`:

```bash
cp .env.example .env
```

Completar los valores:

```env
PORT=3000
JWT_SECRET=tu_clave_secreta_segura
URI_DB=mongodb://localhost:27017/mi_base  # o URI de MongoDB Atlas
```

### 4. Iniciar el servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`.

---

## Endpoints

### Autenticación (públicos)

#### POST `/api/auth/register`

Crea un nuevo usuario y devuelve sus datos.

**Body:**
```json
{
  "username": "leonardo",
  "email": "leo@email.com",
  "password": "Segura123!"
}
```

> La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "664f...",
    "username": "leonardo",
    "email": "leo@email.com",
    "createdAt": "2026-06-11T00:00:00.000Z",
    "updatedAt": "2026-06-11T00:00:00.000Z"
  },
  "message": "User registered successfully"
}
```

---

#### POST `/api/auth/login`

Valida credenciales y devuelve un token JWT.

**Body:**
```json
{
  "email": "leo@email.com",
  "password": "Segura123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

> El token expira en 1 hora. Hay un límite de 5 intentos por IP cada 15 minutos.

---

### Productos (privados — requieren token)

Todos los endpoints de productos requieren el header:

```
Authorization: Bearer <token>
```

---

#### GET `/api/products`

Lista todos los productos del usuario autenticado.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "665a...",
      "name": "Notebook",
      "price": 1200,
      "category": "Electrónica",
      "stock": 5,
      "available": true
    }
  ],
  "message": "Products fetched successfully"
}
```

---

#### GET `/api/products/:id`

Obtiene un producto por ID.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "665a...",
    "name": "Notebook",
    "price": 1200,
    "category": "Electrónica",
    "stock": 5,
    "available": true
  },
  "message": "Product fetched successfully"
}
```

---

#### POST `/api/products`

Crea un nuevo producto asociado al usuario autenticado.

**Body:**
```json
{
  "name": "Monitor",
  "price": 350,
  "category": "Electrónica",
  "stock": 10
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "665b...",
    "name": "Monitor",
    "price": 350,
    "category": "Electrónica",
    "stock": 10,
    "available": true
  },
  "message": "Product created successfully"
}
```

---

#### PATCH `/api/products/:id`

Actualiza un producto. Solo funciona si el producto pertenece al usuario autenticado.

**Body (campos opcionales):**
```json
{
  "price": 300,
  "stock": 8
}
```

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Product updated successfully"
}
```

---

#### DELETE `/api/products/:id`

Elimina un producto. Solo funciona si el producto pertenece al usuario autenticado.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": { ... },
  "message": "Product deleted successfully"
}
```

---

## Códigos de respuesta

| Código | Descripción |
|--------|-------------|
| 200 | OK |
| 400 | Bad Request – campo faltante o ID inválido |
| 401 | Unauthorized – token ausente o inválido |
| 403 | Forbidden – el recurso no pertenece al usuario |
| 404 | Not Found – recurso no encontrado |
| 409 | Conflict – el email ya está registrado |
| 429 | Too Many Requests – límite de intentos superado |
| 500 | Internal Server Error |
