# Configuration des Variables d'Environnement

Pour configurer la synchronisation Google Sheets, créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

## Variables d'Environnement Google Sheets

```bash
# Option 1: Utiliser les credentials directement (recommandé pour la production)
VITE_GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
VITE_GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Option 2: Utiliser un fichier de credentials (pour le développement)
VITE_GOOGLE_SHEETS_CREDENTIALS_PATH=./src/config/google-credentials.json

# ID par défaut de la feuille Google Sheets (optionnel)
VITE_DEFAULT_SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
```

## Instructions

1. Créez un fichier `.env.local` à la racine du projet
2. Copiez les variables ci-dessus dans ce fichier
3. Remplacez les valeurs par vos propres credentials Google
4. Redémarrez le serveur de développement

## Sécurité

⚠️ **Important** : 
- Ne commitez jamais le fichier `.env.local` dans Git
- Le fichier `.env.local` est déjà dans `.gitignore`
- Pour la production, utilisez les variables d'environnement de votre plateforme de déploiement

## Mode Développement

Si aucune variable d'environnement n'est configurée, l'application fonctionnera en mode développement avec des données de fallback. Vous pourrez toujours configurer Google Sheets via l'interface utilisateur.
