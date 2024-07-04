import { Test, TestingModule } from '@nestjs/testing';

import { HashingService } from './hashing.service';

describe('HashingService', () => {
  let service: HashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashingService],
    }).compile();

    service = module.get<HashingService>(HashingService);
  });

  it('Should hash the provided string', async () => {
    expect.assertions(2);

    const str = 'me_to_hash';

    const hashedStr = await service.hashPassword(str);
    const comparedStr = await service.compare(str, hashedStr);

    expect(hashedStr).not.toEqual(str);
    expect(comparedStr).toEqual(true);
  });
});
