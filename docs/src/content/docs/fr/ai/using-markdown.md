---
title: Utiliser la documentation avec un agent de code
description: Fournir à tout agent un contexte Markdown ciblé et canonique sans charger tout le site.
---

Les routes Markdown sont des sources documentaires, pas une raison de faire confiance
aveuglément à un agent. Elles fonctionnent avec tout outil acceptant URL ou Markdown.

## Procédure recommandée

1. Partez de [`llms.txt`](/llms.txt) pour sélectionner les pages minimales.
2. Donnez à l’agent le [guide d’implémentation](/fr/ai/implementation-guide.md).
3. Ajoutez un guide d’environnement, une recette et seulement les builders utilisés.
4. Demandez-lui de justifier chaque choix par un export public et une règle de validation.
5. Lancez vous-même typecheck, build, tests et audit avant d’accepter les changements.

Utilisez `llms-full.txt` seulement si la récupération sélective est impossible. L’anglais
reste le bundle machine canonique. Une route `.md` française existe pour chaque page
française mais n’est pas concaténée dans `llms-full.txt`. L’action « Copier la page en
Markdown » récupère toujours la langue courante.

Ne transmettez jamais secrets, données CMS privées, données client ou URL non publiées
à un agent externe. Employez des fixtures représentatives.
