import { successResponse } from '../utils/response';
import { Gpio } from 'onoff';

const LED = new Gpio(4, 'out');

const raspberryController = {
    blink: (req, res) => {
        const blinkLED = () => {
            if (LED.readSync() === 0) {
                LED.writeSync(1);
            } else {
                LED.writeSync(0);
            }
        };

        const blinkInterval = setInterval(blinkLED, 250);

        const endBlink = () => {
            clearInterval(blinkInterval);
            LED.writeSync(0);
            LED.unexport();
        };

        setTimeout(endBlink, 5000);

        return successResponse(res, { message: 'Blink' });
    }
};

export default raspberryController;