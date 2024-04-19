# projet-01-gestinvest-back

# README

## Prérequis
- Node.js 
- PostgreSQL 

## Installation

1. Clonez ce dépôt sur votre machine locale :

    ```bash
    git clone <lien-du-repo>
    ```

2. Accédez au répertoire du projet :

    ```bash
    cd <nom-du-projet>
    ```

3. Installez les dépendances npm :

    ```bash
    npm install
    ```

## Configuration de la base de données

1. Assurez-vous que PostgreSQL est installé et en cours d'exécution sur votre machine locale.

2. Créez une base de données locale PostgreSQL. Vous pouvez utiliser l'outil en ligne de commande `createdb` ou un outil graphique comme pgAdmin.

3. Une fois la base de données créée, exécutez le script de déploiement SQL pour créer le schéma de base de données :

    ```bash
    psql -U <utilisateur> -d <nom-de-la-base-de-données> -a -f migrations/deploy/createdb.sql
    ```

4. Ensuite, exécutez le script de seeding pour peupler la base de données avec des données initiales :

    ```bash
    psql -U <utilisateur> -d <nom-de-la-base-de-données> -a -f data/seeding.sql
    ```

## Configuration de l'environnement

1. Créez un fichier `.env` à la racine du projet en vous basant sur le fichier `.env.example`.

2. Remplissez toutes les variables d'environnement requises dans le fichier `.env` que vous venez de créer.

## Lancement du serveur

Une fois que vous avez installé les dépendances, configuré la base de données et défini les variables d'environnement, vous pouvez démarrer le serveur en exécutant la commande suivante :

```bash
npm run dev
