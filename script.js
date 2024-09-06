document.addEventListener('DOMContentLoaded', function() {

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x2c3e50,
    resizeTo: window
});
document.getElementById('canvas-container').appendChild(app.view);

const maxCoins = 200; 
const pileHeight = 80; 
const coinSize = 35; 
let coinsOnScreen = 0;
let coinsArray = [];
let interactionsEnabled = true; 
let coinsStolen = 0;

const coinTexture = PIXI.Texture.from('https://cdn.iconscout.com/icon/free/png-256/free-coin-icon-download-in-svg-png-gif-file-formats--dollar-money-currncy-iconhub-pack-miscellaneous-icons-1093492.png'); 

const stealButton = document.getElementById('steal-button');
const stealLabel = document.getElementById('steal-label');

function createCoin(x, y) {
    const coin = new PIXI.Sprite(coinTexture);
    coin.anchor.set(0.5);
    coin.x = x;
    coin.y = y;
    coin.vy = Math.random() * 2 + 1; 
    coin.pileY = window.innerHeight - pileHeight; 
    app.stage.addChild(coin);
    coinsArray.push(coin);
    coinsOnScreen++;
}

function handleTap(event) {
    if (interactionsEnabled && coinsOnScreen < maxCoins*40) {
        const x = event.data.global.x;
        const y = 0; 
        createCoin(x, y);
    }
}

function isColliding(coin, otherCoin) {
    const dx = coin.x - otherCoin.x;
    const dy = coin.y - otherCoin.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < coinSize; 
}

function stealCoins() {
    if (coinsArray.length >= 2) {
        for (let i = 0; i < 2; i++) {
            const coin = coinsArray.pop();
            app.stage.removeChild(coin);
            coinsOnScreen--;
        }
        coinsStolen += 2;
        stealLabel.textContent = `Coins stolen: ${coinsStolen}`;
    }
}

function animate() {
    coinsArray.forEach((coin, index) => {
        coin.y += coin.vy;

        if (coin.y > window.innerHeight - pileHeight) {
            coin.y = window.innerHeight - pileHeight;
            coin.vy = 0;

            for (let i = 0; i < coinsArray.length; i++) {
                if (i !== index) {
                    const otherCoin = coinsArray[i];
                    if (isColliding(coin, otherCoin)) {
                        coin.y = otherCoin.y - coinSize;
                    }
                }
            }
        }
    });

    if (coinsOnScreen * coinSize > window.innerHeight*2) {
        interactionsEnabled = false;
    } else {
        interactionsEnabled = true;
    }

    app.stage.interactive = interactionsEnabled;
    app.render();
}

app.stage.interactive = true; app.stage.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height); 

app.stage.interactive = true;
app.stage.on('pointerdown', handleTap);

app.ticker.add(animate);

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth, window.innerHeight);
});

stealButton.addEventListener('click', stealCoins);
});