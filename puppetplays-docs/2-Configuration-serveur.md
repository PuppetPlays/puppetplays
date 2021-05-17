# Configuration du serveur

Note : Nous partons du principe que la procédure d’installation décrite dans ce document est exécutée sur un serveur avec une distribution Linux Debian 10.

## 1 Architecture

La plateforme utilise “Docker” pour faire tourner les différentes briques logicielles. Le projet est architecturé autour de 3 images “Docker” :
- L'image `postgres`, pour la base de donnée Postgresql
- L'image `puppetplays-admin`, qui lance le cms “[Craft](https://craftcms.com)” et se connecte à la base donnée “Postgresql” pour stocker les données du projet.
- L'image `puppetplays-web` qui lance un serveur `node` faisant tourner le site web

Un serveur “Nginx” installé sur le machine hôte permet de transmettre les requêtes arrivant sur la mahcine vers le bon “container” de la manière suivante :
- Les requêtes arrivant sur `puppetplays.eu` sont transmises au “container” `puppetplays-web`
- Les requêtes arrivant sur `amdin.puppetplays.eu` ou `api.puppetplays.eu` sont transmises au “container” `puppetplays-admin`

Les pages du site web sont générées à la demande sur le serveur. Les données à afficher sont récupérées grâce à l'API `graphql` fournie par “Craft”.

Un schéma reprenant l'architecture complète de la plateforme est visible à l'adresse suivante :
[https://go.stemic.app/maps/4c5bc8de-823b-4784-b3be-2eac37ec3ab6](https://go.stemic.app/maps/4c5bc8de-823b-4784-b3be-2eac37ec3ab6)

## 2 Configuration

### 2.1 Docker

La première étape de configuration consiste à installer le “Docker Engine” qui va permettre de faire tourner les différents services de la plateforme. Pour cela, suivre la documentation relative à la distribution Debian : [https://docs.docker.com/engine/install/debian](https://docs.docker.com/engine/install/debian)

### 2.2 Nginx

La deuxième étape est d'installer le serveur web Nginx >= 1.16.0 qui va servir à distribuer le traffic entrant vers les différentes applications.

```
$ sudo apt update
$ sudo apt install nginx
$ sudo systemctl start nginx
$ update-rc.d nginx defaults
```

Les fichiers de configuration du serveur Nginx sont disponibles dans le dossier `puppetplays-deploy/nginx`, copier le fichier `web`, le fichier `admin` et le dossier `conf` dans le dossier de configuration d’Nginx (/etc/nginx).

```
$ cd [path to puppetplays repository]/puppetplays-deploy/nginx
$ scp $USER@$HOST:/etc/nginx ./conf
$ scp $USER@$HOST:/etc/nginx/sites-available ./web
$ scp $USER@$HOST:/etc/nginx/sites-available ./admin
$ ln -s /etc/nginx/sites-available/web /etc/nginx/sites-enabled/web
$ ln -s /etc/nginx/sites-available/admin /etc/nginx/sites-enabled/admin
```

Avant de redémarrer le serveur Nginx pour qu'il prenne en compte la nouvelle configuration il faut commenter 
toutes les lignes liées à la configuration SSL dans les fichiers `web` et `admin` dans `/etc/nginx/sites-available`.

```
# listen 443 ssl;
# ssl_certificate ...
# sl_certificate_key ...
# include conf/ssl.conf;
```

Vous pouvez maintenant recharger la configuration du serveur Nginx.

```
$ sudo systemctl reload nginx
```

### 2.3 Certbot

La deuxième étape est d'utiliser “Let’s Encrypt” pour obtenir un certificat SSL, pour ce faire il faut installer le composant logiciel Certbot sur le serveur.

```
$ sudo apt update
$ sudo apt install python3-acme python3-certbot python3-mock python3-openssl python3-pkg-resources python3-pyparsing python3-zope.interface
$ sudo apt install python3-certbot-nginx
```

Pour obtenir le certificat SSL, la commande certbot suivante doit être utilisée :

```
sudo certbot --nginx --cert-name puppetplays.eu -d puppetplays.eu -d api.puppetplays.eu -d admin.puppetplays.eu
```

Certbot peut avoir modifié la configuration Nginx, vérifier les lignes ajoutées par certbot et supprimer les lignes conflictuelles et / ou mettre à jour le fichier `conf/ssl.conf`.

Pour recharger Nginx lors du renouvellement du certificat SSL il convient d'ajouter un “renew hook” au “cron job” certbot. Ajouter à la suite du fichier `/etc/cron.d/certbot` la commande `--renew-hook "/etc/init.d/nginx reload"` (juste derrière `certbot -q renew`).

Les lignes correspondants à la configuration SSL Nginx précédemment commentées peuvent être décommentées et la configuration Nginx doit être rechargée.

```
listen 443 ssl;
ssl_certificate ...
sl_certificate_key ...
include conf/ssl.conf;
```

```
$ sudo systemctl reload nginx
```

### 2.4 Structure des dossiers

Toutes les données persistées de la plateforme sont regroupé dans le dossier `/var/lib/puppetplays`.
Ce dossier doit être créé lors de la configuration du serveur :

```
$ cd /var/lib
$ mkdir puppetplays
```

À l'intérieur du dossier `puppetlays`, plusieurs dossiers vont être créés, le dossier `database/postgresql` contiendra les données de la base de donnée postgresql, le dossier `logs` contiendra les différents fichiers de “log” de la plateforme et le dossier `static` contiendra les images, vidéos, ressources statiques téléversées depuis “Craft”.

## 3 Sauvegarde

### 3.1 Base de donnée

Un script de sauvegarde de la base de donnée est disponible dans le dossier `puppetplays-deploy/scripts/db-backup.sh`. Ce script est actuellement executé tous les jours sur le serveur grâce à une entrée `crontab`. Le fichier de sauvegarde lui-même est placé sur le serveur dans le dossier `/etc/cron.d`

### 3.2 Données de la plateforme

En plus de la base de donnée, l'ensemble du dossier `var/lib/puppetplays` est sauvé par les différents mécanismes de sauvegarde spécifiques à HumaNum (voir [https://documentation.huma-num.fr/vm/#sauvegardes-des-machines-virtuelles-et-de-leur-contenu](https://documentation.huma-num.fr/vm/#sauvegardes-des-machines-virtuelles-et-de-leur-contenu)).

## 4 Restauration d'une backup

@TODO: Comment restaurer le backup pqsql