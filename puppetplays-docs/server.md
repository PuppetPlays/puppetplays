# Configuration du serveur

Note : Nous partons du principe que la procédure d’installation décrite dans ce document est exécutée sur un serveur avec une distribution Linux Debian 10.

## 1 Nginx

La première étape est d'installer le serveur web Nginx >= 1.16.0 qui va servir à distribuer le traffic entrant vers les différentes applications.

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

## 2 Certbot

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

## 3 Création des dossiers

Créer les dossiers `puppetplays/database/postgresql` et  `puppetplays/logs` dans le dossier `/var/lib/` du serveur. Ces dossiers vont contenir les données de la base Postgresql et les fichiers de log.