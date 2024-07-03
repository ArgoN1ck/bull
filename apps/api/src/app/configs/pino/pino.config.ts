import { Params } from 'nestjs-pino';

import { environment } from '../../../environment/environment';

export const PinoLoggerConfiguration: Params = {
  pinoHttp: {
    level: environment.pinoLogger.level,
    formatters: {
      level: (label) => ({ level: label }),
    },
    customProps: () => ({
      context: 'PinoLoggerInterceptor',
    }),
    hooks: {
      logMethod: function (
        inputArgs: any[],
        // eslint-disable-next-line @typescript-eslint/ban-types
        method: Function
      ): void {
        if (inputArgs.length >= 1) {
          const record = inputArgs.shift() || {};
          const arg2 = inputArgs.shift();

          return method.apply(this, [record, arg2, ...inputArgs]);
        }
        return method.apply(this, inputArgs);
      },
    },
  },
};
