<!-- metadata_start
Title: About Eleutheria
Description: All about the Eleutheria project.
Date: 2022/10/01
Category: Game Design
metadata_end -->

###### Wed, October 1, 2022

# About Eleutheria

Welcome to the *Eleutheria* website! In this post, I will discuss my goals for the *Eleutheria* project and outline my design principles.

## Existing Literature

There have been *many* rhythm game engines over the years. Most are, as you'd expect, written in languages like C++, optimized for performance. There are a few great open source engines out there - [Stepmania](https://www.stepmania.com/) is probably the most well known. It's designed for lane based games (where the notes move in a linear fashion, usually divided into "lanes" or "columns"). It's written in C++ and supporting scripting with Lua.

Another well loved open source engine is [Osu!](https://osu.ppy.sh/home). It's written in C#. I don't know as much about Osu! in terms of theming and scripting - in terms of the game client, there are *lots* of custom skins. Gameplay looks like it can be scripted using a simple [key:value syntax](https://osu.ppy.sh/wiki/en/Storyboard/Scripting).

Both these engines are desktop applications. They are are well designed and battle tested. A lot can be learned from them! 

Another notable engine is [Bemuse](https://bemuse.ninja/). It's a Beatmania IIDX clone that runs entirely in a browser, and performs beautifully.

All these projects deliver a clean, refined gameplay experience. 

## A Hackable Rhythm Game Engine

So - there are already many great rhythm game engines. Why do we need another one?

What makes *Eleutheria* interesting is the entire game is written using HTML, CSS and JavaScript. Even the gameplay is composed entirely from DOM elements! This is, of course, not very efficient - something like WebGL via Pixi.js or Three.js would be far more performant. The trade off is the game is far more easily modified by non-experts. Making changes using CSS gives you instant feedback. It's responsible by default. JavaScript scripting is hopefully more intuitive and approachable than the Lua API exposed by something like Stepmania, at least for designers and non-developers. 

Although DOM rendering is not nearly as quick as using WebGL, with careful attention and optimization, the game can still easily run at a consistent 60 FPS, even on older machines. Newer machines can comfortable run at 120 FPS. Performance isn't an issue.

## A Complete, In Browser Experience

Many rhythm games use music without the creator's permission, or blatantly distribute unlicensed, stolen music. Not only are all the songs in Eleutheria are used with the artist's express permission, but the artist receives licensing fees. Finally, the client features a bio for each artist, with links to their work. I hope Eleutheria can be a platform to help great musicians gain more exposure and popularity.

## Open to the Core

Eleutheria is completely open source. The code is [available on GitHub](https://github.com/lmiller1990/rhythm). You can find the designs in Figma.
