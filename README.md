# 2025-UTN-GRUPO-1
Repositorio del grupo de trabajo número 1, 2025, en la asignatura Metodologías Ágiles

# Integrantes
- Buiatti Pedro Nazareno
- Caputo Joaquín
- Cirille Lucas
- Laure Valentino
- Pianelli Felipe

# Ejecución en local
### Ejecutá en la carpeta raíz para correr la aplicación
- npm run dev

- (Esto gracias al uso de concurrently y el package.json en la carpeta raíz)

# Estructura del Proyecto
- rutinadeldiaservidor/ (Backend .NET)
- rutinadeldiacliente/ (Frontend React + TypeScript + Vite)
- package.json (Scripts para ejecutar ambas aplicaciones) 

## Prerrequisitos
- **Node.js** (versión 18 o superior)
- **.NET SDK** (versión 6.0, 7.0 u 8.0)
- **npm** (viene con Node.js)

## Instalación y Configuración

### 1. Clonar el repositorio
#### Desde la terminal de Visual Studio o desde Bash
- git clone [URL-del-repositorio]
- cd 2025-UTN-GRUPO-1

### 2. Instalar dependencias en la carpeta raiz
#### Desde la carpeta raíz del proyecto
- npm install -g concurrently

### 3. Instalar dependencias del front
#### Podés hacerlo paso por paso (RECOMENDABLE)
- cd rutinadeldiacliente
- npm install react
- npm install react-dom
- npm install react-router-dom
- npm install @mui/material @mui/icons-material
- npm install @emotion/react @emotion/styled
- npm install bootstrap
- npm install sass
- npm install @types/react-router-dom
- npm install axios
- npm install recharts

#### O instalar con un solo comando
- cd rutinadeldiacliente
- npm install react react-dom react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled bootstrap sass @types/react-router-dom recharts
