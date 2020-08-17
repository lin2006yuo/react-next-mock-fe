console.log({
  env: process.env,
})
export const domain =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3000/api"
