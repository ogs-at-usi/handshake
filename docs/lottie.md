# HOW TO USE LOTTIE

To learn more about this library, check out [this link](https://lottiefiles.com/interactivity).
GitHub available [here](https://github.com/LottieFiles/lottie-interactivity).
Full documentation is [here](https://docs.lottiefiles.com/lottie-interactivity/).


## 1. Add the lottie scripts to the head of the HTML file
```html
<script src="https://unpkg.com/@lottiefiles/lottie-interactivity@latest/dist/lottie-interactivity.min.js"></script>
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
```

## 2. Add the lottie-player tag to the HTML file with:
- src (path or link to the json file)
- transparent background
- speed (keep it 1)
- id (very important)
- style (optional)

```html
<lottie-player
src="https://assets1.lottiefiles.com/packages/lf20_ccxfskpm.json"
background="transparent"
speed="1"
id="firstLottie"
style="width: 300px" 
>
</lottie-player>
```
It might be a good idea to have the lottie-player id the same as the message id.

## 3. Add the script with:
- player (id of the lottie-player)
- mode (scroll, cursor, chain)
- actions (more on this later)

```js
window.addEventListener('load', function () {

    LottieInteractivity.create({
        player: '#firstLottie',
        mode: '', // scroll, cursor, chain
        actions: [],
    });
});
```
You can add multiple lottie-interactivity scripts in the same script (useful for the sticker selection menu).
```js
window.addEventListener('load', function () {

    LottieInteractivity.create({
        player: '#firstLottie',
        mode: '',
        actions: [],
    });

    LottieInteractivity.create({
        player: '#secondLottie',
        mode: '',
        actions: [],
    });

    LottieInteractivity.create({
        player: '#thirdLottie',
        mode: '',
        actions: [],
    });
});
```

## 4. Template mode and actions
Here are some examples of how to use the mode and actions. These should be enough for the stickers.

**Note**: whenever you see  `/* last frame */`, you have to change it to the number of the last frame of the animation. 

Generally, to know how many frames the animation has, you should check on the website where you downloaded the json file. However, the number of frames for the selected sticker animations is available at the end of this document.

### 4.1. Click
This code will make the animation play only when you click on it.
```js
LottieInteractivity.create({
    player: '#firstLottie',
    mode: "cursor",
    actions: [
    {
        type: "click",
        forceFlag: false
    }],
});
```
### 4.2. Hover
This code will make the animation play only when you hover over it.
```js
LottieInteractivity.create({
    player: '#firstLottie',
    mode: "cursor",
    actions: [
    {
        type: "hover",
        forceFlag: false
    }],
});
```
### 4.3. Loop
This code will make the animation loop forever.
```js
LottieInteractivity.create({
    player: '#firstLottie',
    mode: "chain", 
    actions: [
    {
        state: 'loop',
        transition: 'none', 
        frames: [0, /* last frame */]
    }],
});
```
### 4.4. Autoplay + click
This code will make the animation play once automatically and then play again when you click on it.
```js
LottieInteractivity.create({
    player: '#firstLottie',
    mode: 'chain',
    actions: [
        {
            frames: [0, /* last frame */],
            state: 'autoplay',
            reset: true,
            transition: 'onComplete',
        },
        {
            state: 'click',
            forceFlag: true,
            frames: [0, /* last frame */],
            transition: 'click',
            count: 5, // don't worry about this, just keep it
        },
    ],
});
```
### 4.5. Autoplay + hover
This code will make the animation play once automatically and then play again when you hover over it.
```js
LottieInteractivity.create({
    player: '#fourthLottie',
    mode: 'chain',
    actions: [
        {
            frames: [0,  /* last frame */],
            state: 'autoplay',
            reset: true,
            transition: 'onComplete',
        },
        {
            state: 'hover',
            forceFlag: true,
            frames: [0,  /* last frame */],
            transition: 'hover',
            count: 5, // don't worry about this, just keep it
        },
    ],
});
```

### 4.6. Note on animations
Ideally, you should only use one of the previous animations. Those are more than enough to make the stickers work. However, if you want to use different animations, feel free to check out the [library page](https://lottiefiles.com/interactivity).

## 5. Number of frames
Here is the number of frames for the selected sticker animations:
| filename   | frames |
|------------|--------|
| happy.json | 43     |
| sad.json   | 90     |
| stare.json | 119    |
| tired.json | 120    |
| what.json  | 120    |