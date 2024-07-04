export type CreateUserParams = {
  name: string;
  email: string;
  password: string;
};

export type GetUserParams = {
  id: string;
};

export type GetUserByEmailParams = {
  email: string;
};
