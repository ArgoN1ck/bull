import {
  CreateUserDto,
  CreateUserResponseData,
  UsersApi,
} from '@bull/sdk/client';

export class UserFactory {
  private static api = new UsersApi();

  static async create(params: CreateUserDto): Promise<CreateUserResponseData> {
    const {
      data: { data },
    } = await UserFactory.api.create(params);

    return data;
  }
}
