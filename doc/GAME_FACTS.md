# Promuse — game facts for the website

What the website may say about the game, in plain words. The site introduces the game; it does not explain its rules in detail, so this file keeps only what a visitor needs. Each section names where its facts come from in the game repo, so they can be checked when the game changes. Update this file first, then `content/`.

- Game repo: `D:\rhythm-demo-main\rhythm-demo-mobile` (GitHub `Khoand-ed/rhythm-demo-mobile`), read at `origin/main` `7a9cc98` on 2026-11-04.
- The GDD is out of date and is not a source (section 7).

## 1. Platform

- Android. The game is in development.
- iOS may come later; the site does not mention it.

Sources: the game repo's `CLAUDE.md` and `ProjectSettings/ProjectSettings.asset`; the owner.

## 2. How the game plays

- Notes come down two lanes, left and right, in time with the music.
- Three kinds of notes: tap it, hold it, or hit both lanes at once.
- Each hit is graded Perfect, Great or Hit; a note you miss is a Miss.
- Hitting notes without missing builds a combo.
- Missed notes cost HP. Reach the end of the song before your HP runs out.
- Good hits fill the Fever gauge; when it is full, Fever starts and your score climbs faster.

Sources: `Assets/Source/Script/Core/NoteData.cs`, `server/data/ruleset.json`, `TESTING.md` (in the parent folder).

## 3. Characters

Four characters, with the names they have in the game. AMIYA is the name of an Arknights character: it stays during development and is settled before launch (`PHASES.md`, P7).

| Character | Rarity | Passive | What it does |
|---|---|---|---|
| AMIYA | 5★ | Field Medic | The first Miss of a run does not break the combo. |
| NOVA | 4★ | Overdrive | A Great has a chance to be counted as a Perfect. |
| ECHO | 4★ | Resonance | A high combo extends how long Fever lasts. |
| PULSE | 3★ | Steady Beat | Recovers a little HP at a steady interval. |

The passive names and descriptions are the game's own English text; the Vietnamese versions are translations marked `[REVIEW]`.

Stats shown in the character profile:

| Character | HP | Score bonus | Fever bonus |
|---|---|---|---|
| AMIYA | 300 | ×1.2 | ×1.2 |
| NOVA | 275 | ×1.1 | ×1.1 |
| ECHO | 275 | ×1.1 | ×1.1 |
| PULSE | 250 | ×1.0 | ×1.0 |

Sources: `server/data/ruleset.json`, `Assets/Arknights/Resources/Meta/Passive/*.asset`.

## 4. Gacha

- New characters come from a gacha.
- Chances: 5★ 2%, 4★ 10%, 3★ 88%.
- After 30 pulls without a 5★, the next pull is guaranteed to be a 5★.
- The names of the gacha and of its currency are not decided: use placeholders.

Sources: `server/src/Promuse.Persistence/PromuseDbContext.cs`, `server/src/Promuse.Api/Gacha/GachaRoller.cs`.

## 5. Other things to do

- Level up and upgrade your characters.
- Daily and weekly missions, and monthly sign-in rewards.
- Limited-time events and a story campaign.
- Leaderboards, with results checked by the server so rankings stay fair.

Sources: the game repo's `SETUP.md`; `TESTING.md` (in the parent folder).

## 6. What the website must not use

The current build borrows art, names and terms from Arknights. None of them may appear on the site.

- Art: the characters' art and the game's interface, including any screenshot of the current build. Use image placeholders until Promuse-owned art exists.
- Names: Orundum, Originite Prime, LMD, Orirock and the other item names; Headhunting; Sanity; Elite. Use a placeholder where a name is needed, or plain words such as "character", "gacha", "stamina" or "upgrade".

## 7. The GDD

`D:\rhythm-demo-main\GDD.doc` predates the game. Its timing numbers, passives, currency (Gem), progression and platform list no longer match the game. Do not use it as a source.
