import { UsersApi } from '@bull/sdk/client';

import { UserFactory } from './factories';
import { UserFixture } from './fixtures';

describe('User', () => {
  const api = new UsersApi();

  describe('/api/users/', () => {
    describe('POST', () => {
      it('SUCCESS', async () => {
        const userData = UserFixture.create();

        const {
          data: { data, status },
        } = await api.create(userData);

        expect(status).toBe(201);
        expect(data).toBeDefined();
        expect(data).toHaveProperty('id');
      });

      it('FAILURE', async () => {
        const userData = await UserFactory.create(UserFixture.create());

        const {
          data: { status },
        } = await api
          .create({
            email: userData.email,
            name: userData.name,
            password: userData.password,
          })
          .catch((err) => err.response);

        expect(status).toBe(409);
      });
    });

    describe('/get-by-id/{id}', () => {
      it('SUCCESS', async () => {
        const user = await UserFactory.create(UserFixture.create());

        const {
          data: { data, status },
        } = await api.getUserById(user.id);

        expect(status).toBe(200);
        expect(data).toBeDefined();
        expect(data).toHaveProperty('id');
      });

      it('FAILURE', async () => {
        const {
          data: { status },
        } = await api
          .getUserById(UserFixture.createId())
          .catch((err) => err.response);

        expect(status).toBe(400);
      });
    });

    describe('/check-email/{email}', () => {
      it('SUCCESS', async () => {
        const {
          data: { data, status },
        } = await api.checkEmail(UserFixture.createEmail());

        expect(status).toBe(200);
        expect(data).toBeDefined();
        expect(data).toHaveProperty('exists');
        expect(data.exists).toBe(false);
      });

      it('FAILURE', async () => {
        const user = await UserFactory.create(UserFixture.create());

        const {
          data: { status },
        } = await api.checkEmail(user.email).catch((err) => err.response);

        expect(status).toBe(400);
      });
    });
  });
});
