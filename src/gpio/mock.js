exports.Gpio = class GpioMock {
    constructor(pin, mode, edge) {
        this._pin = pin;
        this._mode = mode;
        this._edge = edge;
    }

    watch(fn) {
        console.log(`mocked watch for pin ${this._pin}`);
    }
}
