# Changelog de la plateforme Puppetplays

## Puppetplays 0.5.1

Déployé le 15 juillet 2021

### Corrections

- Les volumes “Videos” et “Sounds” doivent être accessibles à tous les utilisateurs

---

## Puppetplays 0.5.0

Déployé le 15 juillet 2021

### Nouveautés

- Une nouvelle vue “carte” permet de visualiser les œuvres en plus de la vue en liste
- Une nouvelle page “médias” regroupant les médias associés à une œuvre est accessible depuis la page d'une œuvre

### Amélioration

- Ajout d'un style particulier pour les sous-titre d'une œuvre (dans la liste et sur la page de l'œuvre)
- Ajout d'une marge à la fin de la liste des œuvres
- Le menu de navigation principal (répertoire, page des auteurs et page des techniques d'animation) est maintenant accessible depuis un bouton à droite du sélecteur de langue
- Le champ "Hypotexte(s)" d'une oeuvre a été renommé en "Oeuvre(s) corrélée(s)" sur le site et dans l'admin
- La page d'accueil peut maintenant être éditée par les utilisateurs du groupe “chercheurs” et plus seulement par les “admins”

### Corrections

- L'image principale d'un auteur lorsqu'elle s'affiche dans l'encart “auteur” d'une œuvre ne laisse plus de marge sur les côté et remplit tout l'espace disponible
- Le style des hyperliens dans la description d'une technique d'animation est maintenant le bon
- L'image principale d'un auteur s'affiche maintenant dans l'encart “auteur” de la page d'une œuvre
- Le formatage de la date de naissance et de mort d'un auteur sur la page des auteurs est maintenant le même que sur le reste du site
- Éviter un plantage lorsque l’œuvre sélectionnée sur la page d'accueil n'a pas de traduction
- Lorsque le filtre “domaine public” est décoché après avoir était coché la liste des œuvres contient maintenant toute les œuvres et plus seulement celles qui n'était pas du domaine public
- Sur la page d'accueil il n'y avait pas toujours 4 auteurs affichés, ce n'est plus le cas

---

## Puppetplays 0.4.1

Déployé le 21 juin 2021

### Nouveautés

- Nouvelle page d'accueil
- L'état fermé ou ouvert de la barre de filtres est maintenant sauvé sur le navigateur
- Une recherche peut être lancé depuis le menu d'un auteur ou d'une technique d'animation sur ceux-ci
- Les œuvres sont filtrables par mot-clé
- Les mots-clé dans tous le site sont maintenant cliquables et renvoient vers une liste d'œuvres filtrée par mot-clé
- 6 nouveaux filtres font leur apparation dans la barre de filtres des œuvres : “Auteur”, “Registre”, “Technique d’animation”, “Public”, “Format” et “Domaine public”
- 2 nouveaux filtres font leur apparation dans la barre de filtres des auteurs : “Genre” et “Type”


### Amélioration

- Partout où l’on trouve une date de naissance et une date de mort d’un auteur, ces dates sont maintenant toujours formatées de la même manière (point d'interrogation si une date n'existe pas et rien si aucune des deux n'existe)
- Dans la notice d’un auteur, l’identifiant ARK doit être cliquable si c'est une url
- Dans la notice d’une œuvre, l’identifiant ARK doit être cliquable si c'est une url
- Sur la page “auteurs”, lorsque les filtres ne donnent aucun résultat, le texte "aucun résultat" quand à la sélection de filtre on obtient aucun résultat
- La légende et le copyright de l'image principale d'une œuvre s'affiche maintenant au survol de celle-ci
- Plusieurs images peuvent maintenant être associées aux techniques d'animation et aux auteurs
- L'encart Auteur dans une notice de texte a maintenant le même style que les encarts technique d'animation (sur la page "Techniques d'animation")

### Corrections

- Protection contre un crash arrivant lorsque la base de données ne contient aucune œuvre avec au moins date de composition minimum et une date de composition maximum
- Correction d’un problème empéchant l’upload d’image de plus de 1 Mo sur l’admin
- La barre de défilement du contenu principal doit maintenant être toujours à droite de l'écran
- Le nom des auteurs sur une œuvre devrait maintenant être de la bonne couleur

---

## Puppetplays 0.3.0

Déployé le 25 mai 2021

### Nouveautés

- La liste des œuvres est maintenant filtrable par langues, par lieux et par période
- Une nouvelle page “auteurs” a été créée, elle regroupe l’ensemble des auteurs enregistrés sur la plateforme
- Des nouvelles pages dédiées à chaque auteur ont été créées
- La liste des auteurs est maintenant filtrable par langues et par lieux
- La notice d’un auteur peut être affiché directement depuis la liste des œuvres ou la page d’une œuvre depuis un menu situé à droite de nom de l’auteur
- Une nouvelle page “techniques d’animation” a été créée, elle regroupe l’ensemble des techniques d’animation enregistrés sur la plateforme
- Des nouvelles pages dédiées à chaque technique d’animation ont été créées
- La notice d’une technique d’animation peut être affiché directement depuis la liste des œuvres ou la page d’une œuvre depuis un menu situé à droite de nom de la technique d’animation
- Dans l’admin, le plugin “Tags” a été ajouté et permet de mieux gérer les mots-clé

### Amélioration

- Dans l’admin, une technique d’animation peut maintenant avoir une image principale 
- Dans l'admin, le champ “Première représentation (infos complémentaires)” permet d'utiliser l'italique
- Le champs “Hypotextes” permet maintenant de lier des œuvres en plus des œuvres liées

### Corrections

- La “carte” d’un auteur dans la colonne de gauche sur la page d'une œuvre affiche maintenant le nom de l'auteur suivant le formatage standard
- Dans l’admin l’auteur d’un hypotexte affiché sur la page d’une œuvre s’affiche maintenant suivant le formatage standard
- Dans l’admin il n'était auparavant pas possible de sauver plusieurs hypotextes sur une œuvre, c'est n'est plus le cas
- Après une recherche, un clique sur une autre page que la première ne supprime plus la recherche en cours de l’url

---

## Puppetplays 0.2.1

Déployé le 16 avril 2021

### Améliorations

- Dans la liste des personnages de l’admin ”Craft”, le “titre” d’un personnage est maintenant formaté en prenant en compte le nom dans le texte et le pour l’indexation

---

## Puppetplays 0.2.0

Déployé le 16 avril 2021

### Nouveauté

- Une barre de recherche a été ajouté sur le site et permet de rechercher des œuvres
- Les visiteurs non connectés à l”admin sont maintenant redirigés vers une page temporaire présentant le projet et permettant de s'inscrire à la newsletter
- Configuration du système d'envoie de mails depuis l’admin “Craft”
- Gestion des images depuis l’admin “Craft”
- Les personnes, les personnages et les œuvres peuvent maintenant avoir une image principale
- L’image principale d’une œuvre est affichée dans la liste des œuvres et sur la page d’une œuvre, une illustration de substitution s'affiche lorsqu'une œuvre n’a pas d’image principale
- Ajout d'un script de sauvegarde de la base de donnée sur le serveur huma-num
- Ajout d'un plugin – “Workflow” – permettant de gérer le processus de validation entre chercheur et contributeur

### Améliorations

- Nouveau design pour le menu de sélection de la langue sur le site
- Les champs de type “date” sont maintenant des champs de type “nombre” qui permettent de renseigner une année
- Dans la liste des personnes de l’admin ”Craft”, le “titre” d’une personne est maintenant formaté comme sur le site en prenant en compte le nom usuel et le surnom
- Au changement de langue, l'utilisateur est maintenant renvoyé vers la page d’accueil
- Le contenu central sur la page d'une œuvre est maintenant plus large

### Corrections

- La référence bibliographique d’une traduction est maintenant affichée au format html et plus en texte brute
- Quand il n’y avait ni publication, ni édition moderne, ni édition en ligne sur une œuvre, les traductions
ne s’affichaient pas, ce n'est plus le cas
- Correction de style sur les auteurs et la date d'une œuvre
- La pagination de la liste des œuvres affiche maintenant le bon nombre de pages
- Lorsque que seulement le lieu d’une première représentation était renseigné, une virgule s'affichait à la fin, ce n'est plus le cas
- Le bouton permettant d’afficher plus d’information sur une œuvre dans la liste des œuvres est maintenant positionné correctement sur tous les navigateurs

---

## Puppetplays 0.1.0

Déployé le 10 mars 2021

### Nouveauté

- La plateforme est disponible sur le serveur HumaNum de production sur le domaine définitif puppetplays.eu 

---

## Puppetplays 0.1.0-RC4

Déployé le 5 mars 2021

### Améliorations

- Normalisation de l’affichage d'un auteur sur le site (gestion du nom usuel et du surnom)
- Affichage de la date et des auteurs d'un hypotexte après son titre sur le site
- Au survol d’une œuvre dans la liste des œuvres du site le fond de celle-ci passe maintenant en gris clair

### Corrections

- Replacement des 2 couleurs principales sur le site par 2 nouvelles (tirant plus sur le bleu que le violet)
- Replacement de “Techniques de manipulation” par “Techniques de jeu” sur le site

---

## Puppetplays 0.1.0-RC3

Déployé le 15 février 2021

### Nouveautés

- Le site web "public" n'est maintenant accessible qu'aux utilisateurs connecté sur l'admin

### Corrections

- Le widget Supervisor n'affiche maintenant aucune entrée lorsque l'utilisateur n'a aucun contributeur associé
- Rennomage des labels liés aux “personnages” et aux “personnages originaux”

----

## Puppetplays 0.1.0-RC2

Déployé le 5 février 2021

### Nouveautés

- Ajout d’un nouveau groupe d’utilisateurs (“Les contributeurs”) ayant des droits limités
- Quand une nouvelle “entrée” est créée, elle est maintenant désactivée par défaut
- L’interface admin est maintenant disponible en anglais et français en fonction des préférences des utilisateurs
- Ajout d’une coche “domaine public” à une “œuvre”
- Le champ “Informations complémentaires sur la licence” ne s’affiche que lorsque la coche “domaine public” n’est pas coché
- Ajout d’un champ (traduisible) “nom usuel” à une “personne”
- Ajout d’un nouveau type d’entrée “personnage original” qui référence un “personnage” et permet de renseigner le nom original d’un personnage tel qu’il apparait dans l’œuvre, que ce soit pour un texte dans une langue étrangère comme le Flamand ou pour une variante d’écriture du nom
- Le champ “personnages” d’une “œuvre” fait maintenant référence à des “personnages originaux” et non plus à des “personnages” 
- Ajout d’un champ “notice” à une “personnage”

### Améliorations

- Le champs “date” des “œuvres liées” est maintenant au format texte plutôt qu’au format date pour permettre de rentrer des dates non standard ou des dates négatives
- Masquer la popup de sélection de date sur les champs permettant de renseigner une date
- Les champs “résumé“, “notice”, “édition”, “éditions modernes”, “traduction”, “notice biographique” comportent maintenant un bouton permettant de mettre le texte sélectionné en italique
- L’aperçu d’un “hypotexte” ajouté à une œuvre affiche maintenant en plus de son titre, son auteur et sa date
- Le champ “licence” d’une “œuvre” s’appelle maintenant “Informations complémentaires sur la licence”
- Le champ “genre” d’une “personne” n’est plus multi-sélectionnable et ne contient plus que les choix “homme” ou “femme”
- Dans les “œuvres” remplacer “techniques de manipulation” par “techniques de jeu”
- Suppression du champ “lieu de naissance” d’une “personne”
- Les champs liés à “date & lieux d’écriture” et “représentations” sont maintenant rassemblés dans le formulaire d’une “œuvre”
- Le champ “registre” d’une “œuvre” n’est plus limité à un seul “registre” mais peut en référencer plusieurs
- Les champs commençant par “date de publication…” d’une “œuvre” ont été renommé en “date d’édition…”
- Le champ “première publication” d’une “œuvre” a été renommé en “édition”
- Le champ “est lié à” d’un “personnage” a été renommé “autre version du même nom”
- Le champ “titre” d’un “personnage” a été renommé en “nom”
- Le champ “titre” d’un “lieu” a été renommé en “nom”

### Corrections

- Correction d’une faute d’orthographe à “sélectioner” dans les “œuvres”
- Le champ “notice bibliographique” d’une “personne” aurait du s’appeler “notice biographique”
- Correction de plusieurs fautes d’orthographe à “Lieux” quand il est utilisé au singulier

---

## Puppetplays 0.1.0-RC1

Déployé le 18 décembre 2020