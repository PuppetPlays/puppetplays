# Développement

Le mono-répertoire “Puppetplays” contient 3 répertoire principaux :
- `puppetplays-admin` rassemble le code lié au CMS Craft
- `puppetplays-web` rassemble le code lié au site web
- `puppetplays-deploy` rassemble les scripts et fichiers de conf permettant la configuration du serveur et le déploiement sur celui-ci

## Site web

Le site web public Puppetplays est construit avec la librairie [NextJS](https://nextjs.org).

### Pré-requis

Pour développer le site web localement, il faut installer [node 14.17.0](https://nodejs.org/en) et le gestionnaire de paquets [yarn](https://classic.yarnpkg.com/en/docs/install)

### Installation

Une fois `node` et `yarn` installé, la commande suivante permet d'installer toutes les dépendances :

```
$ yarn install
```

### Configuration

Pour communiquer avec le cms Craft, une variable d'environnement référençant l'url de l'API craft doit être renseignée. Pour cela ajouter un fichier
`.env.local` à la racine du dossier `puppetplays-web` et renseigner la variable `NEXT_PUBLIC_API_URL` (voir la documentation de l'admin pour trouver cette url).

### Démarrage

Le serveur de développement peut maintenant être lancé avec la commande suivante (à noter que l'admin Craft doit être lancé pour que le site web puisse faire les requêtes nécessaires à l'affichage de certaines données) :

```
$ yarn start
```

### Test

Ce projet utilise [Jest](https://jestjs.io/fr) et [React testing library](https://testing-library.com/docs/react-testing-library/intro) pour tester les composants React. Utiliser la commande suivante pour lancer les tests pendant le développement :

```
$ yarn run test
```

### Architecture

#### Pages

Le projet utilise l’architecture standard NextJs à quelques détails près. Contrairement à un projet NextJs classique, les pages du site ne se trouvent pas dans le dossier `pages` mais dans le dossier `routes`. Ceci est du à la librairie de traduction utilisé `next-translate`. Toutes les pages du site sont donc regroupées dans le dossier `routes` et le dossier `pages` ne doit en aucun cas être modifié car il est généré automatiquement par la librairie de traduction.

#### Composants

Le dossier `components` contient l’ensemble des composants “React” utilisé sur le site, chaque composant peut être accompagné d'un fichier `[Component].module.scss` qui regroupe les styles de ce composant et/ou d'un fichier `[Component].test.js` regroupant les tests de ce composant.

#### Locales

Le dossier `locales` contient les traductions pour les 4 langues d'affichage du site. Les fichiers sont au format Json et sont utilisés dans les composants pour traduire l'interface du site.

## Admin

L'interface d'admin de Puppetplays est construite avec la CMS [Craft](https://craftcms.com).

### Pré-requis

Pour développer l'interface admin localement, il est conseillé d'installer l'outil [ddev](https://ddev.readthedocs.io/en/stable) qui facilite grandement le lancement des différents briques logiciels. Le projet est pre-configuré pour fonctionner correctement avec `ddev`.

### Configuration

Il est nécessaire de configurer plusieurs variables d'environnement pour que Craft puisse fonctionner correctement. Pour cela, il faut copier le fichier `.env.example` qui se trouve dans le dossier `puppetplays-admin` et le renommer en `.env`. Les variables par défaut devrait permettre de lancer l'application. Le cas échéant il conviendra d'éditer les variables pour les adpater à votre environnement.

### Installation

Une fois le fichier `.env` configuré, les commandes suivantes permettent d'installer toutes les dépendances et d'installer Craft :

```
$ ddev composer install
$ ddev ssh
$ ./craft install
```

### Démarrage

Une fois `ddev` installé et les variables d'environnement configurées, la commande suivante permet de lancer les différents composants (base de donné, serveur web…) :

```
$ ddev start
```
### Architecture

#### Modules

Le projet utilise l’architecture standard Craft. Un module dédié spécifiquement au projet est disponible dans le dossier `modules/sitemodule`. Ce module permet d'étendre Craft et d'ajouter du code spécifique au projet.

#### Traductions

Le dossier `translations` regroupe les traductions des 4 langues de traduction de l'interface.