# 文法チェックリスト · JLPT N5 & N4 Grammar Checklist

A personal progress checklist for closing the gaps in grammar I have already studied, before I move on to more advanced topics (N3 and up).

**Live site:** https://bunpou-check-list.vercel.app

## Why

Going through a textbook once doesn't mean every point has stuck. This site lists every N5 and N4 grammar point in one place, so I can tick off what I can really use in my own sentences and see at a glance what still needs work. The goal is a clean 100% on N5 and N4 before starting N3 material.

## Pages

| Page | What it's for |
| --- | --- |
| [Checklist](https://bunpou-check-list.vercel.app/) | About 120 N5 and N4 grammar points, grouped by topic, each with meaning and an example. Tick a point once you can use it yourself. Includes a progress bar per level, a level filter, search and "Hide done". |
| [Verb conjugation](https://bunpou-check-list.vercel.app/conjugations.html) | Cheat sheet for every verb type (う-verbs, る-verbs, する, 来る, 行く) across all N5/N4 forms: plain and polite, present and past, positive and negative, て-form, potential, passive, causative, conditionals and commands. Practice mode hides the answers. |
| [N5 gaps](https://bunpou-check-list.vercel.app/n5-open-points.html) | Explanations with three example sentences for each N5 point that was still unticked. Done ✓ |
| [N4 gaps](https://bunpou-check-list.vercel.app/n4-open-points.html) | The same for the 22 N4 points still open: て-form combinations, conditionals, guessing and hearsay, decisions and changes, keigo and more. |

## How I use it

1. Go through the checklist and tick every point I can use in my own sentence without looking it up.
2. Work through the unticked points: the explanations, the example sentences and the conjugation table.
3. Write my own sentences for each one, then tick it off.
4. Move on to advanced grammar only when N5 and N4 are at 100%.

Ticks are saved in the browser's local storage, so progress stays on the device and browser where I set it.

## Tech

Plain HTML, CSS and JavaScript with no build step and no dependencies (apart from Google Fonts). Deployed on Vercel; every push to `main` is deployed automatically.

```
index.html             grammar checklist
conjugations.html      verb conjugation cheat sheet
n5-open-points.html    explanations for open N5 points
n4-open-points.html    explanations for open N4 points
```

The grammar points come from two practice stories written for N5 (京都の一日) and N4 (大阪の新しい生活). Grammar lists differ between sources, so this covers the core points rather than every list ever published.
