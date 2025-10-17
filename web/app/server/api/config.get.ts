export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  return {
    apiUrl: config.public.appUrl || 'http://localhost:3000',
  }
})
