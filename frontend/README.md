# Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env     # en Windows: copy .env.example .env
npm install
npm run dev              # http://localhost:5173
```

El backend debe estar corriendo en http://localhost:4000.

## Estructura
- `src/pages/`       páginas (Inicio, Blog, Artículo, Login, Registro)
- `src/components/`  piezas reutilizables (Navbar, Footer, tarjetas, mapa hexagonal)
- `src/context/`     estado global: sesión (AuthContext) y tema (ThemeContext)
- `src/services/`    llamadas a la API (axios)
- `src/locales/`     textos en español e inglés (react-i18next)
- `src/styles/`      estilos globales y variables de tema
