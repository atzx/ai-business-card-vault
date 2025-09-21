<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# About ENG
__AI Business Card Vault__ is an intelligent web application that allows you to easily digitize and organize your business cards. Simply upload an image of a business card and the application will use AI to automatically extract contact information such as name, company, title, etc. All your cards are stored in a centralized and easy-to-search database, turning your collection of physical cards into a vault of digital contacts.

# About ESP
__AI Business Card Vault__ es una aplicación web inteligente que te permite digitalizar y organizar tus tarjetas de presentación de forma sencilla. Simplemente sube una imagen de una tarjeta de presentación y la aplicación utilizará IA para extraer automáticamente la información de contacto, como nombre, empresa, cargo, etc. Todas tus tarjetas se almacenan en una base de datos centralizada y fácil de buscar, convirtiendo tu colección de tarjetas físicas en una bóveda de contactos digitales.

## Run Locally
**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# Kill servers
`kill $(lsof -t -i:5173)`
`kill $(lsof -t -i:3001)`

## Mover tu rama actual a un commit
`git reset --hard <hash_del_commit>`

Esto mueve tu rama al commit indicado.

`--hard`: descarta cambios en el working directory.
`--soft`: mantiene los cambios en staging.
`--mixed`: mantiene los cambios en el working directory pero no en staging.

## Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jwbEhLIjQn3qsajxqNBWzQ_MOBxW0ME9
