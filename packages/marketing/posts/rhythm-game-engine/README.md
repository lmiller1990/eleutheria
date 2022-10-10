In this article, I will demonstrate how to build a simple rhythm game engine for the web, similar to something like Stepmania, Osu!, etc.

The goal of this article is the core **engine** - this means the module to track user input and calculate if a note was hit, how accurately, etc. You could build any kind of user interface on top of this engine - a traditional lane based game, or something more like Osu or Jubeat.

## Concepts

Over the years, there have been many different rhythm game engines; most closed source, but others open. The one I'm most familiar with is Stepmania, which is **time** based, but others, like older DDR games, are **frame based** (or as I understand it, based on my research).

I think, in general, **time based** engines make a lot more sense for a rhythm game, where the core concept is how accurately a player hits a note, which is usually measured in milliseconds.

## Important APIs and Methods

The main APIs I will use are:

- [`performance.now()`](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now), which returns a [`DOMHighResTimeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp). This is accurate to at least millisecond precision, which is appropriate for a rhythm game.
- [`Event.timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp). This is the millisecond at which an event was created. Like `performance.now()`, it returns a `DOMHighResTimeStamp`.

It's worth noting that both these methods have their [precision reduced](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp#reduced_time_precision) to prevent fingerprinting in Firefox. I'd generally recommend Chrome for your rhythm game development; you might want to distribute a desktop binary using Electron, too, so Chrome(ium) is a good platform.

The value of a `DOMHighResTimeStamp` is based on how much time has passed since the document's created. [More info here](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp#the_time_origin). Basically, if you open a new page and run `performance.now()` in the console after about 1 second, you'll see something like 1003.30000001192 - the value is in **milliseconds**. 

In general, I like to normalize everything to milliseconds.

The final API is [`AudioContext.getOutputTimestamp()`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/getOutputTimestamp). `AudioContext` is how I will manage playback. It returns a `AudioTimestamp` which has two timestamps: `contextTime` and `performanceTime`. I will use `performanceTime` - it also returns a `DOMHighResTimeStamp`, with the same units and origin as `performance.now()`.

We will also learn a little about the Web Audio API as we go. Let's get started!
