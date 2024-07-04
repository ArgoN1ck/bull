import { ConfigurableModuleBuilder } from '@nestjs/common';

import { UserModuleOptions } from './configuration.type';

const {
  ConfigurableModuleClass: UserModuleConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: USER_MODULE_OPTIONS,
  ASYNC_OPTIONS_TYPE: asyncOptions,
} = new ConfigurableModuleBuilder<UserModuleOptions>({
  optionsInjectionToken: 'USER_MODULE_OPTIONS [INJECTION TOKEN]',
})
  .setClassMethodName('forRoot')
  .setFactoryMethodName('createUserModuleOptions')
  .setExtras(
    {
      isGlobal: false,
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal,
    })
  )
  .build();

type UserModuleAsyncOptions = typeof asyncOptions;

export {
  USER_MODULE_OPTIONS,
  UserModuleAsyncOptions,
  UserModuleConfigurableModuleClass,
};
