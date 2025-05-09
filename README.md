# CampusConnect - Application de mise en relation étudiants-entreprises

CampusConnect est une application web complète qui facilite la mise en relation entre étudiants et entreprises pour des stages, emplois et événements professionnels.

## Architecture

L'application est construite avec une architecture moderne :
- **Backend** : Flask (Python) avec API REST
- **Frontend** : React avec Material-UI
- **Base de données** : SQLite (développement) / PostgreSQL (production optionnelle)

## Prérequis

- Python 3.8+ 
- Node.js 14+ et npm

## Installation

### 1. Cloner le dépôt

```bash
git clone <url-du-depot>
cd campusconnect
```

### 2. Configurer l'environnement

Créez un fichier `.env` à la racine du projet avec les informations suivantes :

```
# Configuration de l'environnement Flask
FLASK_APP=run.py
FLASK_ENV=development
SECRET_KEY=votre-cle-secrete-tres-securisee

# Configuration de la base de données (optionnel pour SQLite)
# DATABASE_URL=sqlite:///app.db

# Configuration JWT
JWT_SECRET_KEY=votre-cle-jwt-secrete

# Configuration email (à compléter avec vos informations)
MAIL_SERVER=smtp.googlemail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=votre-email@gmail.com
MAIL_PASSWORD=votre-mot-de-passe-ou-cle-app
MAIL_DEFAULT_SENDER=votre-email@gmail.com
```

### 3. Installer les dépendances

```bash
# Installer les dépendances du backend
cd backend
python -m venv venv
venv\Scripts\activate  # Sur Windows
source venv/bin/activate  # Sur Linux/Mac
pip install -r requirements.txt

# Installer les dépendances du frontend
cd ../frontend
npm install
```

### 4. Configurer la base de données SQLite

Exécutez le script de configuration de la base de données :

```bash
python backend/setup_sqlite.py
```

Ce script va :
1. Créer la base de données SQLite si elle n'existe pas
2. Créer les tables nécessaires

## Démarrage de l'application

Vous pouvez démarrer l'application de plusieurs façons :

### Option 1 : Script de démarrage PowerShell (Windows)

```powershell
# Démarrer le backend et le frontend en même temps
.\start.ps1
```

Ce script PowerShell va :
1. Vérifier si les ports 5000 et 3000 sont disponibles
2. Démarrer le backend Flask sur le port 5000
3. Démarrer le frontend React sur le port 3000
4. Afficher les URLs d'accès

### Option 2 : Script de démarrage Python

```bash
# Démarrer le backend et le frontend
python start.py

# Options disponibles
python start.py --env development  # Mode développement (par défaut)
python start.py --env production   # Mode production
python start.py --setup-db         # Configurer la base de données avant le démarrage
python start.py --reset-db         # Réinitialiser la base de données (supprimer et recréer toutes les tables)
python start.py --backend-only     # Démarrer uniquement le backend
python start.py --frontend-only    # Démarrer uniquement le frontend
```

### Option 3 : Démarrage manuel

```bash
# Démarrer le backend
cd backend
venv\Scripts\activate  # Sur Windows
source venv/bin/activate  # Sur Linux/Mac
python ../run.py

# Dans un autre terminal, démarrer le frontend
cd frontend
npm start
```

## Utilisation

Une fois l'application démarrée :
- Le backend est accessible sur http://localhost:5000
- Le frontend est accessible sur http://localhost:3000
- La documentation de l'API est disponible sur http://localhost:5000/api/docs

## Fonctionnalités principales

- **Authentification** : Inscription, connexion, récupération de mot de passe
- **Inscription simplifiée** : Formulaire d'inscription adaptatif selon le type d'utilisateur (étudiant, université, entreprise, mentor, admin)
- **Profils** : Profils étudiants, universités, entreprises et mentors avec informations détaillées
- **Offres d'emploi/stage** : Publication, recherche et candidature
- **Événements** : Organisation et participation à des événements professionnels
- **Messagerie** : Communication directe entre utilisateurs

## Développement

### Structure du projet

```
campusconnect/
├── app/                  # Application Flask
│   ├── api/              # API REST
│   ├── auth/             # Authentification
│   ├── dashboard/        # Tableaux de bord
│   ├── main/             # Pages principales
│   ├── models/           # Modèles de données
│   ├── static/           # Fichiers statiques
│   └── templates/        # Templates HTML
├── backend/              # Scripts backend
├── frontend/             # Application React
│   ├── public/           # Fichiers publics
│   └── src/              # Code source React
├── tests/                # Tests unitaires et d'intégration
├── .env                  # Variables d'environnement
├── config.py             # Configuration de l'application
├── run.py                # Script de démarrage du backend
└── start.py              # Script de démarrage complet
```

### Tests

```bash
# Tests backend
cd backend
pytest

# Tests frontend
cd frontend
npm test
```

## Déploiement en production

Pour déployer l'application en production :

1. Modifiez le fichier `.env` avec les paramètres de production
2. Pour utiliser PostgreSQL en production, ajoutez la variable DATABASE_URL dans votre fichier .env :
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/campusconnect
   ```
3. Exécutez l'application en mode production :
   ```bash
   python start.py --env production
   ```

## Dépannage

### Problèmes de base de données
- Vérifiez que le fichier de base de données SQLite a été créé correctement
- Utilisez `python backend/setup_sqlite.py --reset` pour réinitialiser la base de données (attention : toutes les données seront perdues)

### Problèmes CORS
- Vérifiez que les origines autorisées dans `app/__init__.py` correspondent à l'URL de votre frontend

### Problèmes d'authentification
- Vérifiez que les clés secrètes sont correctement définies dans le fichier `.env`
- En développement, assurez-vous que `SESSION_COOKIE_SECURE` est défini sur `False`

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
