// Uma alternativa para definir estilos sem usar @import do Sass
// src/styles/styles.ts

export const colors = {
  primary: {
    base: '#f2c94c',
    lighten5: '#fffde7',
    lighten4: '#fff9c4',
    lighten3: '#fff59d',
    lighten2: '#fff176',
    lighten1: '#ffee58',
    darken1: '#e6b12e',
    darken2: '#d39e12',
    darken3: '#c08b00',
    darken4: '#a87800'
  },
  secondary: {
    base: '#34495e',
    lighten5: '#eceff1',
    lighten4: '#cfd8dc',
    lighten3: '#b0bec5',
    lighten2: '#90a4ae',
    lighten1: '#78909c',
    darken1: '#2c3e50',
    darken2: '#233240',
    darken3: '#1a252f',
    darken4: '#0d1318'
  }
}

export const typography = {
  fontSizeRoot: '16px',
  borderRadiusRoot: '6px',
  headingFontFamily: "'Roboto', sans-serif",
  bodyFontFamily: "'Roboto', sans-serif"
}

export const transitions = {
  standardEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  transitionFast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionNormal: '0.25s cubic-bezier(0.4, 0, 0.2, 1)',
  transitionSlow: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
}

// Essas variáveis podem ser importadas e usadas nos componentes Vue
// Uma abordagem mais TypeScript-friendly para definir estilos compartilhados
