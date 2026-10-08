import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom'
import news from '../PlataformaNoticias - copia/noticias.json'
import Categorias from './Categorias.jsx'
import './App.css'

const baseUrl = import.meta.env.BASE_URL
const categories = [
  {
    name: 'Tecnología',
    slug: 'tecnologia',
    icon: 'TEC',
    description: 'Innovación digital, ciencia y herramientas que transforman nuestra vida.',
  },
  {
    name: 'Turismo',
    slug: 'turismo',
    icon: 'TUR',
    description: 'Destinos, experiencias y formas responsables de explorar el mundo.',
  },
  {
    name: 'Economía',
    slug: 'economia',
    icon: 'ECO',
    description: 'Tendencias, finanzas personales y actualidad para entender la economía.',
  },
  {
    name: 'Educación',
    slug: 'educacion',
    icon: 'EDU',
    description: 'Ideas, recursos y tendencias para aprender en todas las etapas.',
  },
]
const featuredIds = ['tecnologia', 'turismo', 'economia', 'educacion']
const favoritesKey = 'noticias-digitales-favoritos'

function imageUrl(path) {
  return `${baseUrl}${path}`
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function NewsCard({ item }) {
  return (
    <article className="card">
      <img src={imageUrl(item.imagen)} alt={item.titulo} loading="lazy" />
      <div className="card-content">
        <p className="card-meta">
          <Link className="card-category" to="/categorias">
            {item.categoria}
          </Link>
          <time dateTime={item.fecha}>{formatDate(item.fecha)}</time>
        </p>
      <h3>{item.titulo}</h3>
      <p>{item.descripcion}</p>
      <Link className="btn" to={`/detalle/${encodeURIComponent(item.id)}`}>Ver más</Link>
      </div>
    </article>
  )
}

function Header({ page }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { to: '/', label: 'Home', page: 'inicio' },
    { to: '/noticias', label: 'Noticias', page: 'noticias' },
    { to: '/categorias', label: 'Categorías', page: 'categorias' },
    { to: '/contacto', label: 'Contactos', page: 'contacto' },
  ]

  return (
    <header className="main-header">
      <Link to="/" aria-label="Ir al inicio de Noticias Digitales">
        <img src={imageUrl('img/logo.png')} alt="Noticias Digitales" className="logo-header" />
      </Link>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="nav-principal"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="menu-toggle-icon" aria-hidden="true">☰</span>
        <span className="menu-toggle-label">Menú</span>
      </button>
      <nav className={`nav-menu${menuOpen ? ' is-open' : ''}`} id="nav-principal" aria-label="Navegación principal">
        <ul>
          {links.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={page === link.page ? 'active' : ''}
                aria-current={page === link.page ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <p>© 2026 Noticias Digitales. Información y actualidad para todos.</p>
      <nav className="social" aria-label="Redes sociales">
        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">YouTube</a>
      </nav>
    </footer>
  )
}

function HomePage() {
  const featuredNews = featuredIds
    .map((id) => news.find((item) => item.id === id))
    .filter(Boolean)

  return (
    <>
      <section className="banner">
        <div className="banner-text">
          <h2>Bienvenidos</h2>
          <p>Explora las últimas noticias y experiencias.</p>
          <Link to="/noticias" className="btn">Leer más</Link>
        </div>
      </section>
      <main>
        <section className="destacadas" aria-labelledby="destacadas-title">
          <h2 id="destacadas-title">Noticias Destacadas</h2>
          <div className="grid">
            {featuredNews.map((item) => <NewsCard key={item.id} item={item} />)}
          </div>
          <div className="btn-center">
            <Link to="/noticias" className="btn">Explorar todas las noticias</Link>
          </div>
        </section>
      </main>
    </>
  )
}

function NewsPage({ categoryMode = false }) {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState('recent')
  const [selectedCategory, setSelectedCategory] = useState('Todas')
  const visibleNews = news
    .filter((item) => selectedCategory === 'Todas' || item.categoria === selectedCategory)
    .filter((item) => `${item.titulo} ${item.descripcion} ${item.categoria}`
      .toLocaleLowerCase('es')
      .includes(search.trim().toLocaleLowerCase('es')))
    .sort((first, second) => sortOrder === 'recent'
      ? second.fecha.localeCompare(first.fecha)
      : first.fecha.localeCompare(second.fecha))

  return (
    <main className="catalog-page">
      <section className="destacadas" aria-labelledby="titulo-noticias">
        <p className="page-eyebrow">{categoryMode ? 'Explora las publicaciones por tema' : 'Toda la actualidad en un solo lugar'}</p>
        <h1 id="titulo-noticias">{categoryMode ? 'Categorías de noticias' : 'Todas las noticias'}</h1>
        <p className="page-intro">
          {categoryMode
            ? 'Selecciona una categoría para ver sus noticias.'
            : 'Busca entre las últimas publicaciones o filtra por categoría.'}
        </p>
        <Categorias onFilterChange={setSelectedCategory} />
        <div className="catalog-controls">
          <label className="search-field">
            <span className="visually-hidden">Buscar noticias</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por título, tema o contenido"
            />
          </label>
          <label className="sort-field">
            <span>Ordenar por</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguas</option>
            </select>
          </label>
        </div>
        <p className="results-count" aria-live="polite">
          {visibleNews.length} {visibleNews.length === 1 ? 'noticia encontrada' : 'noticias encontradas'}
        </p>
        <div className="grid" aria-live="polite">
          {visibleNews.map((item) => <NewsCard key={item.id} item={item} />)}
        </div>
        {visibleNews.length === 0 && (
          <div className="empty-state">
            <h2>No encontramos noticias</h2>
            <p>Prueba con otras palabras o limpia la búsqueda para ver todas las publicaciones.</p>
            <button className="btn" type="button" onClick={() => setSearch('')}>Limpiar búsqueda</button>
          </div>
        )}
      </section>
    </main>
  )
}

function NewsCategoryPage() {
  const { slug } = useParams()
  const selectedCategory = categories.find((category) => category.slug === slug)
  const categoryNews = selectedCategory
    ? news.filter((item) => item.categoria === selectedCategory.name)
      .sort((first, second) => second.fecha.localeCompare(first.fecha))
    : []

  if (slug) {
    if (!selectedCategory) {
      return (
        <main className="catalog-page">
          <div className="empty-state">
            <h1>No encontramos esa categoría</h1>
            <Link className="btn" to="/temas">Ver todas las categorías de noticias</Link>
          </div>
        </main>
      )
    }

    return (
      <main className="catalog-page">
        <section className="destacadas" aria-labelledby="category-title">
          <Link className="back-link" to="/temas">← Todas las categorías</Link>
          <p className="page-eyebrow">Explora por tema</p>
          <h1 id="category-title">{selectedCategory.name}</h1>
          <p className="page-intro">{selectedCategory.description}</p>
          <p className="results-count">{categoryNews.length} {categoryNews.length === 1 ? 'noticia' : 'noticias'} en esta categoría</p>
          <div className="grid">
            {categoryNews.map((item) => <NewsCard key={item.id} item={item} />)}
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="catalog-page">
      <section className="destacadas" aria-labelledby="categories-title">
        <p className="page-eyebrow">Encuentra lo que te interesa</p>
        <h1 id="categories-title">Explora por categorías</h1>
        <p className="page-intro">Elige un tema para ver sus publicaciones más recientes.</p>
        <div className="category-grid">
          {categories.map((category) => {
            const categoryCount = news.filter((item) => item.categoria === category.name).length
            const latestArticle = news
              .filter((item) => item.categoria === category.name)
              .sort((first, second) => second.fecha.localeCompare(first.fecha))[0]

            return (
              <Link className="category-card" to={`/temas/${category.slug}`} key={category.slug}>
                <span className="category-card-icon" aria-hidden="true">{category.icon}</span>
                <span className="category-card-content">
                  <span className="category-card-title">{category.name}</span>
                  <span className="category-card-description">{category.description}</span>
                  <span className="category-card-count">
                    {categoryCount} {categoryCount === 1 ? 'noticia' : 'noticias'}
                    {latestArticle && <> · Última: {latestArticle.titulo}</>}
                  </span>
                </span>
                <span className="category-card-arrow" aria-hidden="true">→</span>
              </Link>
            )
          })}
        </div>
        <div className="category-page-cta">
          <p>¿Prefieres ver todo en orden cronológico?</p>
          <Link className="btn btn-secondary" to="/noticias">Ir a todas las noticias</Link>
        </div>
      </section>
    </main>
  )
}

function DetailPage({ id }) {
  const item = news.find((entry) => entry.id === id)
  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')
      return Array.isArray(favorites) && favorites.includes(id)
    } catch (error) {
      console.warn('No se pudo leer la lista de favoritos:', error)
      return false
    }
  })

  function toggleFavorite() {
    let favorites
    try {
      favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]')
      if (!Array.isArray(favorites)) favorites = []
      favorites = isFavorite ? favorites.filter((favoriteId) => favoriteId !== id) : [...favorites, id]
      localStorage.setItem(favoritesKey, JSON.stringify(favorites))
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.warn('No se pudo guardar la lista de favoritos:', error)
    }

  }

  if (!item) {
    return (
      <main className="detail-page">
        <p className="detail-status" role="status">No encontramos la noticia solicitada.</p>
        <div className="btn-center"><Link className="btn" to="/noticias">Volver a noticias</Link></div>
      </main>
    )
  }

  const relatedNews = news
    .filter((entry) => entry.id !== item.id && entry.categoria === item.categoria)
    .slice(0, 3)

  return (
    <main className="detail-page">
      <article className="news-detail">
        <header className="news-detail-header">
          <p className="news-detail-meta">
            <span className="news-category">{item.categoria}</span>
            <time dateTime={item.fecha}>{formatDate(item.fecha)}</time>
          </p>
          <h1>{item.titulo}</h1>
        </header>
        <img className="news-detail-image" src={imageUrl(item.imagen)} alt={item.titulo} />
        <p className="news-detail-description">{item.descripcion}</p>
        <div className="news-detail-body">
          {item.cuerpo.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="news-detail-actions">
          <button className="btn" type="button" aria-pressed={isFavorite} onClick={toggleFavorite}>
            {isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          </button>
          <Link className="btn btn-secondary" to="/contacto">Contactar</Link>
        </div>
      </article>
      {relatedNews.length > 0 && (
        <section className="related-news" aria-labelledby="related-title">
          <h2 id="related-title">Noticias relacionadas</h2>
          <div className="related-grid">
            {relatedNews.map((related) => (
              <Link className="related-card" to={`/detalle/${encodeURIComponent(related.id)}`} key={related.id}>
                <h3>{related.titulo}</h3>
                <p>{related.categoria}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function DetailRoute() {
  const { id } = useParams()
  return <DetailPage id={id} />
}

function LegacyDetailRoute() {
  const [searchParams] = useSearchParams()
  return <DetailPage id={searchParams.get('id') || ''} />
}

function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="contact-page">
      <section aria-labelledby="contact-title">
        <h1 id="contact-title">Contáctanos</h1>
        <p className="contact-intro">¿Tienes una consulta, sugerencia o noticia para compartir? Escríbenos.</p>
        <div className="contact-layout">
          <form className="contact-form" onSubmit={(event) => {
            event.preventDefault()
            setSubmitted(true)
            event.currentTarget.reset()
          }}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input id="nombre" name="nombre" type="text" autoComplete="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="correo">Correo electrónico</label>
              <input id="correo" name="correo" type="email" autoComplete="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="mensaje">Mensaje</label>
              <textarea id="mensaje" name="mensaje" rows="6" required />
            </div>
            <button className="btn" type="submit">Enviar</button>
            {submitted && (
              <p role="status">El formulario es una demostración y todavía no está conectado a un servicio de envío.</p>
            )}
          </form>
          <aside className="contact-info" aria-labelledby="institution-title">
            <h2 id="institution-title">Noticias Digitales</h2>
            <p>Medio digital dedicado a compartir información y actualidad sobre tecnología, turismo, economía y educación.</p>
            <address>
              <strong>Correo institucional</strong><br />
              <a href="mailto:info@noticiasdigitales.com">info@noticiasdigitales.com</a>
            </address>
          </aside>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const updateScroll = () => setShowBackToTop(window.scrollY > 300)
    window.addEventListener('scroll', updateScroll)
    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    if (location.pathname === '/categorias') {
      document.title = 'Categorías de noticias | Noticias Digitales'
    } else if (location.pathname.startsWith('/temas/')) {
      const slug = location.pathname.split('/').filter(Boolean)[1]
      const category = categories.find((entry) => entry.slug === slug)
      document.title = category
        ? `${category.name} | Noticias Digitales`
        : 'Categorías de noticias | Noticias Digitales'
    } else if (location.pathname === '/detalle' || location.pathname === '/detalle.html'
      || location.pathname.startsWith('/detalle/')) {
      const id = location.pathname.split('/').filter(Boolean)[1] || new URLSearchParams(location.search).get('id')
      const item = news.find((entry) => entry.id === id)
      document.title = item ? `${item.titulo} | Noticias Digitales` : 'Noticia no encontrada | Noticias Digitales'
    } else {
      document.title = 'Noticias Digitales | Información y actualidad'
    }

    return undefined
  }, [location.pathname, location.search])

  const page = location.pathname === '/categorias'
    ? 'categorias'
    : location.pathname === '/'
      ? 'inicio'
      : location.pathname === '/contacto'
        ? 'contacto'
        : 'noticias'

  return (
    <>
      <Header page={page} />
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route element={<NewsPage />} path="/noticias" />
        <Route element={<NewsPage categoryMode />} path="/categorias" />
        <Route element={<NewsCategoryPage />} path="/temas" />
        <Route element={<NewsCategoryPage />} path="/temas/:slug" />
        <Route element={<DetailRoute />} path="/detalle/:id" />
        <Route element={<LegacyDetailRoute />} path="/detalle" />
        <Route element={<LegacyDetailRoute />} path="/detalle.html" />
        <Route element={<ContactPage />} path="/contacto" />
        <Route element={<HomePage />} path="*" />
      </Routes>
      <Footer />
      {showBackToTop && (
        <button
          className="back-to-top"
          type="button"
          aria-label="Volver al inicio"
          style={{ display: 'block' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          ↑
        </button>
      )}
    </>
  )
}

export default App
