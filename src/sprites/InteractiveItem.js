import quests from '@/Quests';

class InteractiveItem extends PIXI.Sprite {
    constructor(description, resource, quest, itemType, scenes = null) {
        super(resource);
        this.description = description;
        this.quest = quest;
        this.itemType = itemType;
        this.scenes = scenes;
    }

    interactWith(eventData) {
        switch (eventData.target.itemType) {
            case "quest":
                eventData.target.visible = false;
                quests.quests[eventData.target.quest].isDiscovered = true;
                quests.translatedQuests++;
        
                new Howl({
                    //src: ['media/escriureRapid.wav'],
                    src: ['media/escriureLent.wav'],
                    autoplay: true,
                    loop: false,
                    volume: 3,
                });
                break;
            case "ouija":
                if(quests.ouijaPieceFound) {
                    console.log("gameSpellScene GO!");
                    this.scenes.gameSpellScene.visible = true;
                    setTimeout(() => {
                        this.scenes.gameSpellScene.visible = false;
                        this.scenes.gameOuijaScene.visible = true;
                    }, 1000);
                    
                } else {
                    //TODO show this message on screen only for few seconds, or hide it next time we click somewhere?
                    let ouijaText = new PIXI.Text(this.description,{fontFamily : 'Verdana', fontSize: 15, fill : 0xff1010, align : 'center', strokeThickness: 10} );
                    ouijaText.anchor.x = 0.5;
                    ouijaText.x = eventData.target.x - 50;
                    ouijaText.y = eventData.target.y - 50;
                    ouijaText.parentGroup = eventData.target.parentGroup;
                    ouijaText.visible=true;
                    eventData.target.parent.addChild(ouijaText);
                    console.log(this.description);
                    setTimeout(() => {
                        ouijaText.visible=false;
                    }, 1500);
                }
                break;
            case "open":
                console.log("open type");
                break;
            default:
                console.log("switch interactiveItem event default");
        }
        
    }
}

export default InteractiveItem;
