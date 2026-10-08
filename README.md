# Noticias Digitales

Aplicación React y Vite con portal de noticias, filtros por categoría, detalle de publicaciones, favoritos locales y formulario de contacto. El listado general está en `/noticias` y los botones de categorías están en `/categorias`.

## Desarrollo local

```sh
npm install
npm run dev
```

## Verificación

```sh
npm run lint
npm run build
```

## Publicación en GitHub Pages

El workflow de GitHub Actions de `.github/workflows/deploy.yml` compila y publica el sitio al hacer push a `main`. En GitHub, configura **Settings → Pages → Build and deployment → Source: GitHub Actions**. Si la rama principal del repositorio no se llama `main`, actualiza el filtro de ramas del workflow.

La navegación usa React Router con `HashRouter`, conservando compatibilidad con GitHub Pages. La ruta `/categorias` se visita como `/#/categorias` en el navegador. Vite usa rutas relativas para que funcione tanto en sitios de usuario como en repositorios de proyecto sin configurar manualmente el nombre del repositorio.

El formulario de contacto es solo de interfaz; para recibir mensajes debe conectarse a un servicio o backend de formularios.
