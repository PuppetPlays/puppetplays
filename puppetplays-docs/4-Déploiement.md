# Déploiement

Ce document décrit la procédure de déploiement utilisée pour le projet PuppetPlays.

## 1 Principes de deploiement

Le déploiement du projet se déroule en plusieurs étapes:

1. Les images Docker sont construites et poussées sur le registre Docker.
2. Un script deploy.sh est exécuté sur le serveur pour récupérer les dernières images et les démarrer.
3. Les images sont associées aux bons volumes sur le serveur pour persister les données.

## 2 Images Docker

Les images Docker sont construites depuis les sources du projet et sont publiées sur le registre Docker hub ([https://hub.docker.com/r/puppetplays/puppetplays-admin](https://hub.docker.com/r/puppetplays/puppetplays-admin) et [https://hub.docker.com/r/puppetplays/puppetplays-web](https://hub.docker.com/r/puppetplays/puppetplays-web)) pour être éventuellement déployées plus tard.

## Intégration continue

Le projet Puppetplays est actuellement configuré pour utiliser le service d'intégration continue [CircleCI](https://circleci.com). Ce service permet à chaque "push" par un développeur sur le répertoire Github sur lequel le code source du projet est hébergé de lancer un processus permettant le déploiement de l'application.

La configuration du processus est disponible dans le dossier `.circleci/config.yml`.

### Tester et construire le code

La première étape du processus d'intégration consiste à lancer les tests pour s'assurer qu'aucune régression n'a été introduite par le développeur et si c'est bien le cas, de "builder" le code source pour qu'il soit prêt à être distribué.

### Construire les images Docker

Une fois le code construit et testé, les images Docker du site et de l'admin sont construites puis stockées sur Docker hub ([https://hub.docker.com/r/puppetplays/puppetplays-admin](https://hub.docker.com/r/puppetplays/puppetplays-admin) et [https://hub.docker.com/r/puppetplays/puppetplays-web](https://hub.docker.com/r/puppetplays/puppetplays-web)) pour être éventuellement déployées plus tard.

### Déployer les images Docker

Une fois les images Docker générées, elles peuvent être déployé sur le serveur de staging ou sur le serveur de production depuis l'interface de CircleCI.
À noter que la branche `develop` peut seulement être déployée en "staging" et que la branche `master` peut seulement être déployée en "production".