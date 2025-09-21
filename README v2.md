# AI Business Card Vault

Aplicación en **React + TypeScript + Vite** para escanear, guardar y organizar tarjetas de presentación usando **OCR** y un buscador inteligente.

---

## 🚀 Requisitos

- macOS, Linux o Windows
- [Node.js LTS](https://nodejs.org/) (recomendado instalar con `nvm`)
- npm (incluido con Node.js)

Verifica que estén instalados:

```bash
node -v
npm -v
```

---

## 📦 Instalación

1. Clona este repositorio o descomprime el ZIP.
2. Entra a la carpeta del proyecto:

```bash
cd ai-business-card-vault
```

3. Instala dependencias:

```bash
npm install
```

---

## ▶️ Desarrollo

Ejecuta el servidor de desarrollo con:

```bash
npm run dev
```

Luego abre la URL que te indique la terminal (por defecto: [http://localhost:5173](http://localhost:5173)).

---

## 🏗️ Compilación para Producción

Genera la build optimizada:

```bash
npm run build
```

Para probarla localmente:

```bash
npm run preview
```

---

## ⚙️ Variables de Entorno

El proyecto usa un archivo `.env.local` para configurar claves y endpoints (ej. Google Gemini API).  
Crea o edita el archivo con tus credenciales:

```env
VITE_API_KEY=tu_api_key_aqui
```

---

## 📚 Tecnologías

- [React 19](https://react.dev/)
- [Vite 6](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Google GenAI SDK](https://www.npmjs.com/package/@google/genai)

---

## 📝 Scripts Disponibles

- `npm run dev` → Inicia servidor de desarrollo
- `npm run build` → Compila la app para producción
- `npm run preview` → Sirve la build de producción
