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
                    translation: [baseX + cos * 2, 0.1, baseZ + sin * 2],
                    rotation: [-Math.PI / 2, 0, 0],
                    rotationAmount: Math.random() * 0.2 - 0.1,
                    type: "2d",
                    depth: 0.05,
                    //textureLocation: "./assets/images/fuji.jpg",
                    frameColor: 0xfad912,
                    width: 0.4,
                    height: 0.4,
                    behaviorModules: ["Drag"]
                });
                this._cardData.cards.push(text.id);
            }
        }

        this.subscribe(this.sessionId, "startAnimation", "startAnimation");
    }

    startAnimation() {
        if (this.runner) {
            this.runner.destroy();
            delete this.runner;
            return;
        }
        this.runner = this.createCard({
            type: "object",
            noSave: true,
            behaviorModules: ["Animator"],
            cardIds: this._cardData.cards
        });
    }

    teardown() {
        if (this.runner) {
            this.runner.destroy();
            delete this.runner;
        }
    }
}

class AnimatorActor {
    setup() {
        this.running = true;
        this.step();
    }

    step() {
        if (!this.running) {return;}
        if (!this._cardData.cardIds) {return;}
        this._cardData.cardIds.forEach((id) => {
            let card = this.service("ActorManager").actors.get(id);
            if (!card) {return;}
            card.rotateBy([0, card._cardData.rotationAmount, 0]);
        });
        this.future(50).step();
    }

    teardown() {
        this.running = false;
    }
}

class StartButtonActor {
    setup() {
        this.addEventListener("pointerTap", "start");
    }

    start() {
        this.publish(this.sessionId, "startAnimation");
    }
}

class StartButtonPawn {
    setup() {
        if (this.box) {
            this.box.removeFromParent();
        }

        let THREE = Microverse.THREE;

        let geom = new THREE.SphereGeometry(0.5);
        let mat = new THREE.MeshStandardMaterial({color: this.actor._cardData.color || 0x22dd22, metalness: 0.6});
        this.box = new THREE.Mesh(geom, mat);
        this.shape.add(this.box);
    }
}



export default {
    modules: [
        {
            name: "CardMaker",
            actorBehaviors: [CardMakerActor],
        },
        {
            name: "Animator",
            actorBehaviors: [AnimatorActor],
        },
        {
            name: "StartButton",
            actorBehaviors: [StartButtonActor],
            pawnBehaviors: [StartButtonPawn],
        }
    ]
};

/* globals Microverse */
