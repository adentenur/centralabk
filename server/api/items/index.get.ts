export default defineEventHandler(() => {
  const rows = db.prepare('SELECT * FROM items ORDER BY id ASC').all() as ItemRow[]
  return rows.map(mapItem)
})
