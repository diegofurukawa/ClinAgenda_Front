// // index.ts
// import { default as SimpleTemplate } from './DefaultTemplate.vue'
// import { default as AuthTemplate } from './DefaultAuthTemplate.vue'

// // Defina aqui a condição para escolher o template
// const isAuth = import.meta.env.VITE_USE_AUTH

// // Pode substituir por uma lógica como process.env.AUTH_ENABLED ou outra constante
// const DefaultTemplate = isAuth ? AuthTemplate : SimpleTemplate

// // Exporta diretamente como "DefaultTemplate" baseado na condição
// export { DefaultTemplate }

// export { default as DefaultTemplate } from './DefaultTemplate.vue'
export { default as DefaultTemplate } from './DefaultAuthTemplate.vue'

