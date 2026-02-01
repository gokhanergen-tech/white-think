class Keyboard {

    currentKey = null;
    ctrlZ = false;
    ctrlY = false;
    ctrl = false;
    zKey = false;
    yKey = false;

    constructor() {
        this.initialize();
    }

    getCurrentKey() {
        return this.currentKey;
    }

    keyUp = (e) => {
        this.currentKey = null;

        if (e.key === "Control")
            this.ctrl = false;
        if (["z", "Z"].includes(e.key))
            this.zKey = false;
        if (["y", "Y"].includes(e.key))
            this.yKey = false;

        if (!this.zKey || !this.ctrl) {
            this.ctrlZ = false;
        }

        if (!this.yKey || !this.ctrl) {
            this.ctrlY = false;
        }

    }


    keyDown = (e) => {
        this.currentKey = e.key;

        if (e.key === "Control")
            this.ctrl = true;
        if (["z", "Z"].includes(e.key))
            this.zKey = true;
        if (["y", "Y"].includes(e.key))
            this.yKey = true;


        if (this.zKey && this.ctrl) {
            this.ctrlZ = true;
        }

        if (this.yKey && this.ctrl) {
            this.ctrlY = true;
        }
    }

    initialize() {
        document.addEventListener("keydown", this.keyDown)
        document.addEventListener("keyup", this.keyUp)
    }

    clear() {
        document.removeEventListener("keydown", this.keyDown);
        document.removeEventListener("keyup", this.keyUp);
    }


}