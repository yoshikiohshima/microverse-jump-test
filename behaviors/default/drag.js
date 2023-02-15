class DragPawn {
    setup() {
        this.addEventListener("pointerMove", "pointerMove");
        this.addEventListener("pointerDown", "pointerDown");
        this.addEventListener("pointerUp", "pointerUp");
    }

    pointerMove(evt) {
        if (!this.downInfo) {return;}
        if (!evt.ray) {return;}

        let {THREE, v3_add, v3_sub} = Microverse;
        let origin = new THREE.Vector3(...evt.ray.origin);
        let direction = new THREE.Vector3(...evt.ray.direction);
        let ray = new THREE.Ray(origin, direction);

        let dragPoint = ray.intersectPlane(
            this._dragPlane,
            new Microverse.THREE.Vector3()
        );

        let down = this.downInfo.downPosition;
        let drag = dragPoint.toArray();

        let diff = v3_sub(drag, down);
        let newPos = v3_add(this.downInfo.translation, diff);

        let [x,y,z] = newPos;

        this.set({translation: newPos});
    }

    pointerDown(evt) {
        if (!evt.xyz) {return;}
        let {THREE, q_yaw, v3_rotateY} = Microverse;

        // let normal = [q_pitch(this.rotation), q_yaw(this.rotation), q_roll(this.rotation)];
        let normal = [0, 1, 0];

        this._dragPlane = new THREE.Plane();
        this._dragPlane.setFromNormalAndCoplanarPoint(
            new THREE.Vector3(...normal),
            new THREE.Vector3(...evt.xyz)
        );

        this.downInfo = {translation: this.translation, downPosition: evt.xyz};
        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.addFirstResponder("pointerMove", {}, this);
        }
    }

    pointerUp(_evt) {
        this._dragPlane = null;
        let avatar = this.getMyAvatar();
        if (avatar) {
            avatar.removeFirstResponder("pointerMove", {}, this);
        }
    }
}

export default {
    modules: [
        {
            name: "Drag",
            pawnBehaviors: [DragPawn]
        }
    ]
}
