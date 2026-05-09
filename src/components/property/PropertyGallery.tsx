import { useState } from 'react'
import { galleryUrls } from '../../lib/mockData'
import { useFavorites } from '../../hooks/useFavorites'

interface Props {
  propertyId: string
  photos?: string[]
}

export default function PropertyGallery({ propertyId, photos }: Props) {
  const imgs = photos?.length ? photos : galleryUrls(propertyId)
  const [idx, setIdx] = useState(0)
  const { isFavorite, toggle } = useFavorites()
  const fav = isFavorite(propertyId)

  const prev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length)
  const next = () => setIdx((i) => (i + 1) % imgs.length)

  return (
    <div className="gallery">
      <button className={`fav-btn${fav ? ' on' : ''}`} onClick={() => void toggle(propertyId)}>
        <i className={`fa-${fav ? 'solid' : 'regular'} fa-heart`} />
      </button>
      <button className="gal-arrow left" onClick={prev}>
        <i className="fa-solid fa-chevron-left" />
      </button>
      <button className="gal-arrow right" onClick={next}>
        <i className="fa-solid fa-chevron-right" />
      </button>
      <div
        className="gal-main"
        style={{ backgroundImage: `url(${imgs[idx]})` }}
      />
      <div className="gal-counter">{idx + 1} / {imgs.length}</div>

      <div className="thumb-strip" style={{ padding: '10px' }}>
        {imgs.map((url, i) => (
          <div
            key={i}
            className={`thumb${i === idx ? ' active' : ''}`}
            style={{ backgroundImage: `url(${url})` }}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}
