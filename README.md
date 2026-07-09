# 📌 Journal de Bord

## 📅 8 Juin 2026

### 🔄 Contexte Métier & Flux de Données

En raison des restrictions légales sur le démarchage téléphonique direct, le flux d'acquisition client respecte désormais le parcours suivant :

```text
[Publicité] ➔ (1) Formulaire Client ➔ (2) Entreprise Partenaire ➔ HTTP Req ➔ (3) API Satel ➔ Application Finale

```

1. **Acquisition :** Le client clique sur une publicité et remplit un formulaire de contact.
2. **Transmission :** L'entreprise partenaire récupère ces leads et les transmet à **Satel** via des requêtes HTTP.
3. **Consommation :** L'application de Satel récupère ces données par API, les traite, puis les expose de manière accessible aux utilisateurs finaux.

### 🛠️ Architecture & DevOps

* **Docker :** Présentation globale de l'architecture réseau sous Docker *(pas de tâches assignées pour le stage)*.
* **CI/CD :** Utilisation de **Jenkins** pour l'automatisation des pipelines de déploiement.

---

### 💻 Stack Technique : NestJS & TypeORM

L'application repose sur un modèle **CRUD** (*Create, Read, Update, Delete*) et utilise **TypeORM** (*Object-Relational Mapper*) pour faire le pont entre la programmation orientée objet en Node.js et la base de données relationnelle.

#### 1. L'Entité (Modélisation de la BDD)

Les classes sont décorées pour correspondre directement aux tables de la base de données.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    isActive: boolean;
}

```

> 💡 **Note :** À partir de cette entité, TypeORM génère automatiquement la table `user` avec les colonnes `id`, `firstName`, `lastName` et `isActive`.

#### 2. Le Repository (Interaction BDD)

Le pattern Repository est utilisé pour manipuler les données sans écrire de requêtes SQL brutes.

```typescript
// Récupérer tous les utilisateurs actifs
const activeUsers = await userRepository.find({ 
    where: { isActive: true } 
});

// Instancier et sauvegarder un nouvel utilisateur
const newUser = new User();
newUser.firstName = "John";
newUser.lastName = "Doe";

await userRepository.save(newUser);

```

---

### 🚀 Automatisation : Jenkins (CI/CD)

Jenkins orchestre toutes les étapes critiques entre la soumission du code par un développeur et sa mise en production effective.

```text
[ Code ] ──> 1. Build ──> 2. Test ──> 3. Deploy ──> [ Production ]

```

* **1. Build :** Installation des dépendances et packaging de l'application.
* **2. Test :** Exécution automatisée des tests (unitaires, intégration) et analyse de la qualité de code via **SonarQube**.
* 🚨 *Si un test échoue, Jenkins "casse le build", bloque le pipeline et alerte l'équipe. Aucun bug ne passe en production.*

* **3. Deploy :** Si toutes les étapes précédentes sont au vert, Jenkins livre automatiquement l'artefact (conteneur Docker, archive, etc.) sur le serveur ciblé.

---

### 🎯 Objectifs de la Première Semaine

Mettre en place deux projets distincts (Front et Back) qui communiquent ensemble.

* **Modèle :** CRUD simple pour un système de gestion de clients.
* **Structure d'un Client :** `id`, `nom`, `prénom`, `numéro de téléphone`.
* *État d'avancement initial (J1) :* Réalisation des routes `GET` et `GET :id` avec Node.js pur.

---

## 📅 9 Juin 2026

### 🖥️ Travail sur le Backend (NestJS)

#### 1. Initialisation du projet

```bash
# Installation globale de la CLI NestJS
npm install -g @nestjs/cli 

# Création du nouveau projet backend
nest new client-backend --package-manager npm 
cd client-backend

# Génération des briques de l'architecture
nest g module clients 
nest g controller clients --no-spec 
nest g service clients --no-spec

```

> 💡 **Note sur les commandes :** Le flag `--no-spec` permet d'éviter la génération des fichiers de tests (`.spec.ts`) pour cette phase d'entraînement.

#### 2. Flux de données NestJS

```text
[Requête HTTP] ➔ Contrôleur (Intercepte) ➔ Service (Logique métier) ➔ [Base de données / Données locales]

```

#### 3. Écriture des fichiers

* **Interface :** Définition de la structure du client. 📄 [`client.interface.ts`](https://www.google.com/search?q=/perso/client-backend/src/clients/interfaces/client.interface.ts)
* **Service :** Gestion d'un tableau local simulant la BDD et implémentation des méthodes CRUD avec auto-incrémentation des IDs. 📄 [`app.service.ts`](https://www.google.com/search?q=/perso/client-backend/src/app.service.ts)
* **Contrôleur :** Exposition des routes REST et mapping des verbes HTTP. 📄 [`app.controller.ts`](https://www.google.com/search?q=/perso/client-backend/src/app.controller.ts)

#### 4. Validation des routes (Postman)

| Méthode | Route | Action | Body (JSON) |
| --- | --- | --- | --- |
| **GET** | `/clients` | Récupère tous les clients | *Aucun* |
| **GET** | `/clients/1` | Récupère le client `ID: 1` | *Aucun* |
| **POST** | `/clients` | Crée un nouveau client | `{"nom": "Martin", "prenom": "Lucas", "telephone": "0708090102"}` |
| **PUT** | `/clients/1` | Modifie le téléphone du client `ID: 1` | `{"telephone":"0677162744"}` |
| **DELETE** | `/clients/1` | Supprime le client `ID: 1` | *Aucun* |

---

### 🎨 Partie Frontend (Angular)

#### 1. Création du Projet Frontend

```bash
# Installation de la version 13 d'Angular CLI
npm install -g @angular/cli@13

# Génération de l'application sans routing et avec CSS classique
ng new client-management --routing=false --style=css
cd client-management

```

#### 2. Écriture des fichiers

* **Modèle :** Création de l'interface du client côté Front. 📄 [`clients.models.ts`](https://www.google.com/search?q=/perso/client-management/src/app/models/clients.models.ts)
* **Template :** Structure HTML pour l'affichage dynamique de la liste. 📄 [`app.component.html`](https://www.google.com/search?q=/perso/client-management/src/app/app.component.html)

---

## 📅 10 Juin 2026

### 📈 Avancement du projet (Début de journée)

* **Back-End (NestJS) :** ` OK ` (Fonctionnel avec Postman)
* **Front-End (Angular) :** `EN COURS`

> 🔍 **Prochaine étape :** Remplacer les données locales du Front par des requêtes HTTP (`HttpClient`) pour consommer l'API du Back-End.
> ⚠️ **Point de vigilance :** Bien maîtriser le cycle de vie et la portée (scopes) des services sur Angular et NestJS.

---

### 🔄 Focus Technique : Cycle de vie des Services

#### 🅰️ Portée des Services en Angular

La durée de vie d'un service Angular dépend de l'endroit où il est déclaré :

* **`providedIn: 'root'` (Singleton Global) :**
* Le service est instancié uniquement à sa première injection (Lazy instantiation).
* L'instance est unique et **partagée** à travers toute l'application.
* Il survit tant que l'application est ouverte.

* **`providers: [...]` dans un Composant (Instance Locale) :**
* Une nouvelle instance du service est créée à **chaque fois** que ce composant est instancié.
* Si un composant est affiché 3 fois simultanément, il y aura 3 instances indépendantes du service.
* Le service est détruit automatiquement dès que le composant hôte est détruit.

* **Module Lazy-Loaded :**
* Le service se comporte comme un singleton, mais uniquement au sein du périmètre de ce module spécifique chargé à la demande.

#### 🦁 Portée des Services en NestJS

NestJS propose 3 niveaux de scopes pour ses injections de dépendances :

* **`DEFAULT` (Singleton) 🌟 *Recommandé* :**
* Une seule instance unique est créée au démarrage du serveur.
* Elle est partagée pour **toutes** les requêtes de **tous** les utilisateurs.
* C’est le mode le plus performant et adapté à 95% des cas.

* **`REQUEST` (Scope de Requête) :**
* Une nouvelle instance est générée pour **chaque requête HTTP** entrante.
* Elle est automatiquement détruite une fois la réponse renvoyée au client.
* *Attention :* Très lourd en mémoire et impacte les performances si mal utilisé. Utile principalement pour injecter des métadonnées spécifiques à la requête (comme des tokens ou contextes spécifiques).

* **`TRANSIENT` (Scope Temporaire) :**
* Une nouvelle instance est créée chez chaque composant/service qui l'injecte dans son constructeur.
* Mode très rare, principalement utilisé pour des services utilitaires sans état (stateless) ou nécessitant une isolation extrême (ex: un générateur d'IDs uniques internes).

## 📅 11 Juin 2026

### 🖥️ Approfondissement sur le fonctionnement du logiciel de l'entreprise

#### 🔒 Sécurité

Système de guard à chaque requêtes
-> On vérifie qu'un utilisateur est bien connecté avant de lui donner accès à une ressource.

On a :

-Le JWT : C'est un jeton crypté généré par le serveur après que l'utilisateur se soit connecté. Il contient des informations (ex: l'ID de l'utilisateur, ses rôles) et une date d'expiration. L'utilisateur le stocke et le renvoie à chaque requête (souvent dans le header Authorization: Bearer <TOKEN>).

-Le Guard : C'est un morceau de code qui se place juste avant les contrôleurs. Son unique rôle est de regarder la requête qui arrive et de dire si il a les accès ou pas

#### Affichage

Utilisation du framework UI Nebular.
C'est un framework qui va apporter à Angular de nombreuses choses comme une bibliothèque de composants UI, un système de gestion des thèmes, un module d'authentification et une gestion des rôles et des permissions.

#### Base du projet

Utilisation du template Ngx-Admin
C'est un template qui offre plusieurs composants UI déjà designés et intégrés pour créer des panneaux d'administration (graphiques, cartes, tableaux, formulaires, cartes interactives, etc.).

Satel ont donc repris ce template puis l'onn modifiés pour ajouter tout ce qui leur étais nécessaire pour la gestion de leur entreprise.

### Travail du jour

Ajout du style pour le projet perso : [Voir fichier](/perso/client-management/src/app/app.component.css)

Difficultées pour la suppression
-> Comme les requêtes sont asynchrones, je ne rechargeais pas la page lors d'une suppression par exemple.
Le composant doit s'abonner aux méthodes de modification du service et recharger la liste des clients une fois que l' API à validé l'action. 

## 12 Juin

A voir pour le formulaire : reactive form
-> possibilité de rajouter des contraintes, tableaux

node 22.2

## 15  juin

Altitude script developper

Gerer appels entrants
agent auto qui prend en charge l'appel - voix qui annonce le service puis mise dans file d'attente avec sons a jouer

DNIS -> mapping avec numtel

Alterner prefixe -> profile

Dupliquer un profil 

Simplifier au max

Reflechir à la mise en page Angular
type orm avec bdd
zod pour gestion d'erreur

vulcania


Voir par la suite Zod pour la validation des données
Puis faire des tests unitaires

## Objectifs du 25/06/2026

Documentation complète du code
Association de tout les boutons aux code API

## Réunion du 26/06/2026

Compte rendu d'une réunion sur l'avancement du projet

Tableau en trop car duplication des données. 
Zod pas au bon endroit -> à décaler sur le backend -> cest lui qui envoie les données donc c'est a lui de vérifier si c'est OK
Problème dans la forme des données dans le back. Le préfixe à un id_profile. Il faudrais qu'il ai directement un objet profile.

## Réunion du 03/07/2026

Voir pour regarder sur une version d'angular plus récentes.

## Compte rendu du 03/07/2026

📌 Point hebdomadaire – Semaine du 29 juin au 3 juillet 2026
1. État d'esprit
Semaine un peu plus difficile : des problèmes personnels m'ont fatigué, ce qui a probablement ralenti mon rythme de travail.
2. Missions

Correction de l'affichage en doublon d'un tableau sur la page principale du module.
Restructuration du modèle de données côté backend : passage d'une relation par identifiant (id_profile) à une relation directe entre le préfixe et son profil (many-to-one / one-to-many).
Migration de la validation des données (Zod) du frontend vers le backend, pour l'entité "profiles".

3. Avancement

Le tableau en doublon a été supprimé, corrigeant le problème de duplication des données identifié lors de la réunion du 26/06.
La relation entre préfixe et profil a été revue pour que le préfixe possède directement un objet profil, conformément aux retours de l'équipe.
Zod a été implémenté côté backend pour les profils, la logique de validation étant plus cohérente à cet endroit puisque c'est le backend qui envoie les données.

4. Succès

J'ai réussi à corriger le point bloquant identifié en réunion concernant la structure des données du préfixe.
J'ai réussi à avancer sur mes tâches malgré une semaine personnellement compliquée.

5. Débrief

Le changement de modèle côté backend a désynchronisé le frontend, qui n'est plus adapté à la nouvelle structure des données.
Cela génère encore des difficultés, notamment sur les fonctionnalités de modification, que je dois corriger la semaine prochaine pour que front et back soient de nouveau cohérents.

## PROBLEME DU 08/07

Problème : erreurs 500 lors de la duplication des horaires d'un profil (race condition sur l'attribution des identifiants)

Lors de la duplication d'un profil, les horaires associés étaient recréés via une boucle envoyant toutes les requêtes de création en parallèle. Or le service back-end calculait lui-même le prochain identifiant en lisant le maximum existant, au lieu de s'appuyer sur l'auto-incrément de la base. Les requêtes simultanées lisant le même maximum avant toute insertion, elles tentaient d'insérer le même identifiant : la contrainte de clé primaire était violée, provoquant des erreurs 500 et la perte silencieuse de certains horaires.

Résolution : suppression du calcul manuel de l'identifiant côté back-end, en laissant la base de données l'attribuer automatiquement et de manière atomique lors de l'insertion. Cela supprime la concurrence à la racine et garantit qu'un identifiant unique est généré pour chaque horaire, même lorsque les requêtes arrivent simultanément.

---

Dans le cadre de ma deuxième année de BUT Informatique à l'IUT Clermont Auvergne, j'ai effectué un stage d'une durée de huit semaines, du 8 juin au 31 juillet 2026, au sein de l'entreprise Satel, une agence spécialisée dans la téléphonie située à Vichy. J'ai eu l'opportunité d'intégrer le service de la Direction des Systèmes d'Information (DSI), une équipe au cœur de l'infrastructure technique et logicielle de l'entreprise. Satel déploie son expertise autour de deux activités principales : le démarchage téléphonique (appels sortants) et le service après-vente (SAV / appels entrants) pour le compte de ses nombreuses entreprises partenaires.

Pour mener à bien ses opérations quotidiennes, Satel s'appuie sur une application développée en interne nommée Satel Platform, qui utilise le template d'interface NgX-Admin. Parallèlement, pour la gestion de ses flux d'appels entrants — notamment pour associer un service client à une bande sonore spécifique ou orchestrer les redirections —, l'entreprise utilise un second outil historique appelé Altitude Script Develloper, dont le rôle se résume essentiellement à de la gestion de bases de données.

Cependant, la multiplication de ces outils tiers engendre une dispersion de l'information et commence à poser des limites en termes d'ergonomie et de maintenance. Pour l'entreprise, l'enjeu actuel est crucial : il s'agit de moderniser son infrastructure logicielle, de fluidifier le travail des équipes et de gagner en efficacité opérationnelle. C'est dans ce contexte de transformation digitale que s'inscrit ma mission, visant à amorcer la transition complète d'un système vieillissant vers une solution unifiée.

Dès lors, la problématique centrale de ce stage peut se formuler ainsi :
Comment concevoir et intégrer un module web centralisé au sein de l'application existante Satel Platform afin de remplacer un outil historique de gestion d'appels, tout en surmontant la contrainte liée à l'apprentissage à court terme d'un nouvel écosystème technique ?

En effet, la réalisation de ce projet présentait un défi de taille : l'architecture de Satel Platform repose sur les frameworks Angular (pour la partie front-end) et NestJS (pour la partie back-end), deux technologies modernes qui m'étaient seulement connues par leur nom à mon arrivée. Ma première semaine de stage a donc été intégralement consacrée à une phase intensive de recherche, de prise en main et de manipulation de ces outils afin de monter en compétences et d'acquérir l'autonomie nécessaire au développement.

L'objectif final et le livrable attendu à l'issue de ces huit semaines de stage consistent à livrer un module complet, autonome et parfaitement fonctionnel en environnement local. Ce module doit être techniquement mûr pour être importé et déployé à terme sur la plateforme de production de Satel. De plus, afin de décorréler le développement des données sensibles de l'entreprise, l'architecture du module a été pensée sans lien direct avec la base de données de production. Cette approche offre le double avantage de sécuriser l'application logicielle tout en me permettant de conserver l'intégralité du code source développé afin de valoriser pleinement ce travail technique lors de mes futures démarches universitaires et professionnelles.
