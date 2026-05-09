export default function MLSBadge({ mlsNumber }: { mlsNumber?: string }) {
  if (!mlsNumber) return null
  return <span className="pc-badge">{mlsNumber}</span>
}
