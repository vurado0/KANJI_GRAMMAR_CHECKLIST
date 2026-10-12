# 文法チェックリスト · Bunpou Checklist (JLPT N5 → N2)

A personal progress checklist for Japanese grammar. I tick off what I can really use, close the gaps level by level, and only then move on to more advanced grammar.

**Live site:** https://bunpou-check-list.vercel.app

## Why

Going through a textbook once doesn't mean every point has stuck. This site lists the core JLPT grammar from N5 to N2 in one place, so I can tick off what I can use in my own sentences and see at a glance what still needs work. Each level gets a "gaps" page for the points that were still open, and a level is only closed when its gaps page is done.

## Pages

| Page | What it's for | Status |
| --- | --- | --- |
| [Bunpou checklist](https://bunpou-check-list.vercel.app/) | About 330 grammar points across N5 (68), N4 (53), N3 (109) and N2 (102), grouped by topic, each with meaning and an example. Level tabs, a progress bar per level, search and "Hide done". | Ongoing |
| [Verb conjugation](https://bunpou-check-list.vercel.app/conjugations.html) | Cheat sheet for every verb type (う-verbs, る-verbs, する, 来る, 行く) across all N5/N4 forms: plain and polite, present and past, positive and negative, て-form, potential, passive, causative, conditionals and commands. Practice mode hides the answers. | Reference |
| [N5 gaps](https://bunpou-check-list.vercel.app/n5-open-points.html) | Explanation and three examples for each N5 point that was still open. | Done ✓ |
| [N4 gaps](https://bunpou-check-list.vercel.app/n4-open-points.html) | The same for the 22 open N4 points, including a keigo table. | Done ✓ |
| [N3 gaps](https://bunpou-check-list.vercel.app/n3-open-points.html) | The 69 open N3 points in more depth: meaning, how each one attaches (Form), pitfalls (Notes) and one example for every variation (Uses), 253 sentences in total. | In progress |

## How I use it

1. Go through a level on the checklist and tick every point I can use in my own sentence without looking it up.
2. Work through that level's gaps page: the explanations, the example sentences and the conjugation table.
3. Write my own sentences for each point, then tick it off.
4. Close the level (cross out its gaps page) and move up.

Ticks are saved in the browser's local storage, so progress stays on the device and browser where I set it.

## Tech

Plain HTML, CSS and JavaScript with no build step and no dependencies (apart from Google Fonts). Deployed on Vercel; every push to `main` is deployed automatically.

```
index.html             bunpou checklist, N5 to N2 (open a level directly with #n5 … #n2)
conjugations.html      verb conjugation cheat sheet
n5-open-points.html    explanations for open N5 points
n4-open-points.html    explanations for open N4 points
n3-open-points.html    detailed explanations for open N3 points
n3-checklist.html      redirect to index.html#n3 (old link)
```

The N5 and N4 points come from two practice stories (京都の一日 and 大阪の新しい生活). Grammar lists differ between sources, so every level covers the core points rather than every list ever published.
