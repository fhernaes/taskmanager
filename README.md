# 📝 Sistema de Gestión de Tareas con Autenticación (Next.js + NextAuth.js)

Este proyecto es una aplicación web para gestión de tareas con autenticación integrada, construida con **Next.js** y **NextAuth.js**.

---

## 🚀 Características Principales

- ✅ Autenticación segura con NextAuth.js
- ✅ Gestión de usuarios y tareas con Prisma ORM
- ✅ Contraseñas cifradas con bcrypt
- ✅ Interfaz moderna con React y Bootstrap
- ✅ Formularios con React Hook Form y validación robusta
- ✅ Íconos mediante React Icons

---

## ⚙️ Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- npm o yarn
- PostgreSQL en local o en la nube

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/fhernaes/taskmanager.git
cd taskmanager
```

2. Instala dependencias:

```bash
npm install
# o
yarn install
```

3. Configura el entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver sección siguiente).

4. Inicializa la base de datos:

```bash
npx prisma generate
npx prisma migrate dev
```

5. (Opcional) Crea el usuario administrador demo:

El proyecto incluye un script de seed automático para crear un usuario administrador demo si no existe. Puedes ejecutarlo en cualquier entorno tras migrar la base de datos:

```bash
npx prisma db seed
```

Esto creará el usuario:

- **Usuario:** admin
- **Email:** admin@fhernaes.com
- **Contraseña:** admin123
- **Rol:** admin

Puedes cambiar estos valores editando `prisma/seed.mjs`.

---

## 🔐 Variables de Entorno

Crea un archivo `.env` basado en este ejemplo:

```env
NODE_ENV=development
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/nombre_db
NEXTAUTH_SECRET=clave_secreta
NEXTAUTH_URL=http://localhost:3000
```

Nunca subas el archivo `.env` real a GitHub. Usa `.env.example` para referencia.

---

## 📜 Scripts Disponibles

| Comando           | Descripción                           |
|-------------------|---------------------------------------|
| `npm run dev`     | Inicia servidor de desarrollo         |
| `npm run build`   | Compila la app para producción        |
| `npm run start`   | Ejecuta la app compilada              |
| `npm run lint`    | Corre el linter de código             |

---

## 🧰 Tecnologías Utilizadas

- **Next.js** 15.0.3
- **React** 18.3.1
- **NextAuth.js** 4.24.10
- **Prisma** 5.22.0
- **Bootstrap** 5.3.3
- **React Hook Form** 7.53.2
- **bcrypt** 5.1.1
- **React Icons** 5.3.0

---

## 🚀 Despliegue

Está listo para desplegarse en [Vercel](https://vercel.com/) u otro proveedor compatible con Node.js.

---
