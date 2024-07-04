import { CreateUserDto } from '@bull/sdk/client';
import { faker } from '@faker-js/faker';

export class UserFixture {
  static create(): CreateUserDto {
    return {
      email: faker.internet.email(),
      name: faker.internet.userName(),
      password: faker.internet.password({ length: 16 }),
    };
  }

  static createId() {
    return faker.string.uuid();
  }

  static createEmail() {
    return faker.internet.email();
  }
}
