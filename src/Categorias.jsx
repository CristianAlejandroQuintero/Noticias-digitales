import { useState } from 'react'
import './Categorias.css'

const categories = ['Todas', 'Tecnología', 'Turismo', 'Economía', 'Educación']

function Categorias({ onFilterChange }) {
  const [selectedCategory, setSelectedCategory] = useState('Todas')

  function selectCategory(category) {
    setSelectedCategory(category)
    onFilterChange?.(category)
  }

  return (
    <nav className="news-category-filters" aria-label="Filtrar noticias por categoría">
      {categories.map((category) => (
        <button
          aria-pressed={selectedCategory === category}
          className={`news-category-filter${selectedCategory === category ? ' is-active' : ''}`}
          key={category}
          onClick={() => selectCategory(category)}
          type="button"
        >
          {category}
        </button>
      ))}
    </nav>
  )
}

export default Categorias
