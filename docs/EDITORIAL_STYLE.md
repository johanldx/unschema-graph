# Guide éditorial de la documentation

Ce fichier fixe le vocabulaire partagé par les documentations anglaise et française.
L'anglais est la source canonique ; la version française conserve les noms d'API et
traduit les concepts sans modifier leur portée technique.

## Glossaire bilingue

| Concept | Anglais canonique | Français retenu | Règle d'usage |
| --- | --- | --- | --- |
| Builder | builder | builder | Fonction publique qui valide une entrée et produit une entité Schema.org. Définir le terme à sa première occurrence dans un parcours débutant. |
| Entity | entity | entité | Objet Schema.org produit ou accepté par la bibliothèque. |
| Graph | graph / `@graph` | graphe / `@graph` | Employer `@graph` pour la clé JSON-LD et « graphe » pour le concept. |
| Reference | reference | référence | Lien entre entités lorsqu'il s'agit de données ; « documentation de référence » pour la section API. |
| Validation | validation | validation | Toujours préciser s'il s'agit du typage TypeScript, de Zod à l'exécution ou de l'audit du HTML. |
| Serialization | serialization | sérialisation | Transformation sûre du graphe en texte JSON-LD destiné au HTML. Ne pas employer « assainissement » ou « sanitization » pour cette seule opération. |
| Audit | audit | audit | Analyse du HTML compilé par la CLI ou l'API ; ce n'est pas une garantie d'éligibilité à un moteur de recherche. |
| Structured data | structured data | données structurées | Utiliser ce terme pour le concept général et JSON-LD pour le format produit. |
| Runtime | runtime | exécution | Moment où Zod valide les données, y compris pendant un build SSG ou un rendu SSR. |
| Rich result | rich result | résultat enrichi | Possibilité contrôlée par le moteur de recherche, jamais une sortie garantie de la bibliothèque. |

## Règles de formulation

- Dire « valide selon le builder » lorsqu'une donnée passe le schéma Zod concerné.
- Dire « JSON-LD bien formé » lorsque seule la syntaxe a été vérifiée.
- Séparer les contraintes de la bibliothèque, le vocabulaire Schema.org et les
  recommandations propres à une plateforme.
- Ne pas promettre de classement, de citation par une IA, de résultat enrichi ou
  d'affichage dans un assistant.
- Décrire la sérialisation comme une protection contre la fermeture prématurée de la
  balise `<script>`, pas comme un nettoyage général de contenus non fiables.
- Garder les noms de fonctions, props, types, packages et clés JSON-LD inchangés dans
  les deux langues.
- Utiliser la casse de phrase dans les titres et libellés, sauf nom propre ou API.

## Statut du projet

Tant que les packages restent en `0.x`, employer « pré-1.0 ». Expliquer que l'API est
documentée et testée, mais peut encore évoluer avant `1.0`. Ne pas utiliser « stable »
sans politique de compatibilité explicite.
