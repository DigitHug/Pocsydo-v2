# Configuration Google Sheets pour SydoFlow

Ce guide vous explique comment configurer la synchronisation bidirectionnelle avec Google Sheets pour vos pages Projets, Pipeline et DashFlow.

## 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API Google Sheets :
   - Allez dans "APIs & Services" > "Library"
   - Recherchez "Google Sheets API"
   - Cliquez sur "Enable"

## 2. Créer un compte de service

1. Dans Google Cloud Console, allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "Service Account"
3. Donnez un nom à votre compte de service (ex: "sydoflow-sheets")
4. Cliquez sur "Create and Continue"
5. Téléchargez le fichier JSON des credentials

## 3. Configurer la feuille Google Sheets

1. Créez une nouvelle feuille Google Sheets
2. Partagez-la avec l'email du compte de service (trouvé dans le fichier JSON)
3. Donnez les permissions "Editor" au compte de service
4. Copiez l'ID de la feuille depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

## 4. Structure des feuilles

Votre feuille Google Sheets doit contenir 4 onglets (structure basée sur vos fichiers CSV) :

### Onglet "Projets"
Colonnes : ID | Nom | Client | Statut | Priorité | Deadline | Responsable | Progression | Description

### Onglet "Equipe"
Colonnes : Nom | Rôle | Disponibilité | Spécialité | Projets Actifs

### Onglet "Pipeline"  
Colonnes : ID | Nom | Client | Valeur | Probabilité | Date Contact | Actions | Couleur | Stage

### Onglet "KPIs"
Colonnes : Titre | Valeur | Sous-titre | Tendance

## 4.1. Initialisation automatique

L'application peut automatiquement créer la structure et remplir les données de base basées sur vos fichiers CSV. Cela se fait automatiquement lors de la première connexion si la feuille est vide.

## 5. Configuration dans l'application

1. Lancez l'application
2. Allez sur la page "Projets"
3. Cliquez sur "Configuration Google Sheets"
4. Collez l'ID de votre feuille
5. Testez la connexion
6. Sauvegardez la configuration

## 6. Fonctionnalités

### Synchronisation automatique
- Les données se synchronisent automatiquement toutes les 30 secondes
- Vous pouvez forcer une synchronisation avec le bouton de rafraîchissement

### Synchronisation bidirectionnelle
- Les modifications dans l'application sont sauvegardées dans Google Sheets
- Les modifications dans Google Sheets sont récupérées par l'application

### Gestion des erreurs
- L'application affiche des badges de statut pour indiquer l'état de la connexion
- En cas d'erreur, l'application utilise les données de fallback

## 7. Sécurité

⚠️ **Important** : Ne commitez jamais vos fichiers de credentials dans le repository Git.

Pour la production, utilisez des variables d'environnement :
```bash
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

## 8. Dépannage

### Erreur "Permission denied"
- Vérifiez que le compte de service a accès à la feuille
- Vérifiez que l'API Google Sheets est activée

### Erreur "Invalid credentials"
- Vérifiez que le fichier JSON des credentials est correct
- Vérifiez que le compte de service est actif

### Données ne se synchronisent pas
- Vérifiez l'ID de la feuille
- Vérifiez la structure des onglets
- Consultez la console du navigateur pour les erreurs

## 9. Support

Pour toute question ou problème, consultez :
- [Documentation Google Sheets API](https://developers.google.com/sheets/api)
- [Documentation Google Cloud Console](https://cloud.google.com/docs)
