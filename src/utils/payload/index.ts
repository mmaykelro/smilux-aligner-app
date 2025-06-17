export async function relalidatePaths({ req, paths }: { req?: any; paths: string[] }) {
  for (const path of paths) {
    await fetch(`${req?.origin || ''}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    }).catch((error) => console.log({ error }))
  }
}
