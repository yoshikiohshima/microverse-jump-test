class PickupActor {
    setup() {
        this.listen("pickup", "pickup");
        this.listen("drop", "drop");
    }

    pickup(data) {
        if (this.parent) {return;}
        if (this.pickedUp) {return;}
        let {avatar, viewId, transformation} = data;
        this.pickedUp = viewId;


        this.set({
            parent: avatar,
            translation: Microverse.m4_getTranslation(transformation),
            rotation: Microverse.m4_getRotation(transformation)
        });
    }

    drop(data) {
        if (!this.parent) {return;}
        let {transformation, viewId} = data;
        if (this.pickedUp !== viewId) {return;}

        this.pickedUp = null;

        this.set({
            parent: null,
            translation: Microverse.m4_getTranslation(transformation),
            rotation: Microverse.m4_getRotation(transformation)
        });
    }
}

class PickupPawn {
    setup() {
        this.addEventListener("pointerDown", "pointerDown");
    }

    pointerDown(evt) {
        let g = this.global;
        let avatar = this.getMyAvatar();
        if (this.actor.pickedUp == this.viewId) {
            let avatar = this.getMyAvatar();
            this.say("drop", {avatar: avatar.actor, viewId: this.viewId, transformation: g});
            avatar.removeFirstResponder("pointerDown", {}, this);
            return;
        }

        let inv = Microverse.m4_invert(avatar.global);
        let t = Microverse.m4_multiply(g, inv);

        avatar.addFirstResponder("pointerDown", {}, this);

        this.say("pickup", {avatar: avatar.actor, viewId: this.viewId, transformation: t});
    }
}

export default {
    modules: [
        {
            name: "Pickup",
            actorBehaviors: [PickupActor],
            pawnBehaviors: [PickupPawn],
        }
    ]
}

/* globals Microverse */
