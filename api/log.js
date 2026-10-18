// Receives client error reports (see src/lib/report.js) and writes them to the Vercel runtime logs.
export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).end()
    return
  }
  let report = req.body
  if (typeof report === 'string') {
    try {
      report = JSON.parse(report)
    } catch {
      report = { message: report }
    }
  }
  console.error('[client-error]', JSON.stringify(report ?? {}).slice(0, 4000))
  res.status(204).end()
}
