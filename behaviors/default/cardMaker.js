class CardMakerActor {
    setup() {
        if (this._cardData.cards) {
            this._cardData.cards.forEach((id) => {
                let card = this.service("ActorManager").actors.get(id);
                if (card) {
                    card.destroy();
                }
            });
        }
        this._cardData.cards = [];

        for (let j = 0; j < 10; j++) {
            for (let i = 0; i < 10; i++) {
                let baseX = ((j % 5) - 2.5) * 10;
                let baseZ = (Math.floor(j / 5) - 1) * 10;

                let sin = Math.sin((Math.PI  * 2 / 10) * i);
                let cos = Math.cos((Math.PI  * 2 / 10) * i);

                let text = this.createCard({
                    name:'sticky note',
                    className: "TextFieldActor",
                    translation: [baseX + cos * 2, 0.1, baseZ + sin * 2],
                    rotation: [-Math.PI / 2, 0, 0],
                    type: "text",
                    depth: 0.05,
                    margins: {left: 20, top: 20, right: 20, bottom: 20},
                    backgroundColor: 0xf4e056,
                    frameColor: 0xfad912,
                    runs: [{text: `${j + 1}-${i + 1}`}],
                    width: 0.4,
                    height: 0.4,
                    textScale: 0.004
                });
                this._cardData.cards.push(text.id);
            }
        }
    }
}

export default {
    modules: [
        {
            name: "CardMaker",
            actorBehaviors: [CardMakerActor],
        }
    ]
};
