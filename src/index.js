import Wizard from '@/sprites/Wizard';
import Countdown from '@/Countdown';
import createUI from '@/sprites/UI';
import createRooms from '@/roomManager';
//import GameState from '@/GameState';
import '@/css/index.css'


PIXI_LAYERS;

const app = new PIXI.Application({width: 800,
                                  height: 600,
                                  antialias: true,
                                  transparent: false,
                                  resolution: 1});

document.body.appendChild(app.view);

let clickX = 0;     //global variable to store direction of walking +/-
let wizard;        //global variable where we will store class of wizard
let countDown;
let gameScene;
let gameOverScene;
let gameWonScene;
let gameMenuScene;

//we load here all images to catch them
PIXI.loader
    .add("images/wizard.json")
    .add("images/fireplace.png")
    .add("images/livingroom.png")
    .add("images/kitchen.png")
    .add("images/mug.png")
    .add("images/ouijawb_small.png")
    .add("images/chest.png")
    .add("images/book.png")
    .add("images/book-fireplace.png")
    .add("images/book-page.png")
    .add('fonts/gullhorn.ttf')
    .on("progress", loadProgressHandler)
    .load(menu);

function loadProgressHandler(resource) {
    console.log("progress: " + PIXI.loader.progress + "%");
}

function menu() {
    app.stage = new PIXI.display.Stage();

    gameMenuScene = new PIXI.Container();
    let menuNameText = new PIXI.Text("Game Name",{fontFamily : 'Verdana', fontSize: 42, fill : 0xff1010, align : 'center', strokeThickness: 10} );
    let menuStartText = new PIXI.Text("Click/tap to start",{fontFamily : 'Verdana', fontSize: 24, fill : 0xff1010, align : 'center', strokeThickness: 10} );
    menuNameText.x = app.view.width/2;
    menuNameText.y = app.view.height/2;
    menuNameText.anchor.x = 0.5;
    menuNameText.anchor.y = 0.5;
    menuStartText.x = app.view.width/2;
    menuStartText.y = app.view.height/2 + 100;
    menuStartText.anchor.x = 0.5;
    menuStartText.anchor.y = 0.5;
    gameMenuScene.addChild(menuNameText);
    gameMenuScene.addChild(menuStartText);
    gameMenuScene.interactive = true;
    gameMenuScene.on('pointerdown', setupGame);
    app.stage.addChild(gameMenuScene);
}

function setupGame() {
    console.log("setup");
    gameMenuScene.visible = false;
    //app.stage = new PIXI.display.Stage();
    var mainContainer = new PIXI.Container();
    app.stage.addChild(mainContainer);

    var backgroundDisplayGroup = new PIXI.display.Group(-1, false);
    app.stage.addChild(new PIXI.display.Layer(backgroundDisplayGroup));


    var wizardDisplayGroup = new PIXI.display.Group(5, false);
    app.stage.addChild(new PIXI.display.Layer(wizardDisplayGroup));

    var uiDisplayGroup = new PIXI.display.Group(10, false);
    app.stage.addChild(new PIXI.display.Layer(uiDisplayGroup));

    const room = createRooms(backgroundDisplayGroup, mainContainer);
    room.background.on('pointerdown', onClickWalk);
    room.rightRoom.background.on('pointerdown', onClickWalk);
    room.leftRoom.background.on('pointerdown', onClickWalk);
    room.render();

    //we now show here the background and items. Order matters
    createUI(uiDisplayGroup, mainContainer);

    wizard = new Wizard("images/wizard.json", wizardDisplayGroup, mainContainer);
    countDown = new Countdown(uiDisplayGroup, mainContainer);

    //we create the "clock" with delta value, that will refresh the stuff
    app.ticker.add(delta => gameLoop(delta));

}

function gameLoop(delta) {
    wizard.checkWizardWalk(clickX);
    countDown.refresh();
}

function onClickWalk () {
    console.log("onclickwalk");
    let click = app.renderer.plugins.interaction.mouse.global;
    clickX = click.x;
    wizard.walk(clickX);  
}

export {setupGame};