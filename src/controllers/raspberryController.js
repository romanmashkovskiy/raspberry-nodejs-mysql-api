import { successResponse } from '../utils/response';
import { Gpio } from 'onoff';

const LED = new Gpio(4, 'out');

const raspberryController = {
    blink: (req, res) => {
        if (LED.readSync() === 0) {
            LED.writeSync(1);
        } else {
            LED.writeSync(0);
        }

        return successResponse(res, { message: 'led toggled' });
    },
    clear: (req, res) => {
        LED.writeSync(0);
        LED.unexport();

        return successResponse(res, { message: 'cleared' });
    },
};

export default raspberryController;