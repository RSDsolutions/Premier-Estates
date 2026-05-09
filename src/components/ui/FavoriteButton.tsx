import { useFavorites } from '../../hooks/useFavorites'

export default function FavoriteButton({ propertyId }: { propertyId: string }) {
  const { toggle, isFavorite } = useFavorites()
  const active = isFavorite(propertyId)
  return (
    <button className={`pc-fav ${active ? 'on' : ''}`} onClick={(e) => { 
        e.preventDefault(); 
        toggle(propertyId); 
    }}>
      <i className={`fa-heart ${active ? 'fa-solid' : 'fa-regular'}`} />
    </button>
  )
}
