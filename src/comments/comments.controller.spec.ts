import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

const mockCommentsService = {
  create: jest.fn(),
  findBySnippet: jest.fn(),
  remove: jest.fn(),
};

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: typeof mockCommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        { provide: CommentsService, useValue: mockCommentsService },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get(CommentsService);
  });

  it('deve chamar o service.create', async () => {
    const dto = { content: 'Oi', snippetId: 1 };
    const req = { user: { userId: 1 } };
    await controller.create(req, dto);
    expect(service.create).toHaveBeenCalledWith(1, dto);
  });

  it('deve listar comentários', async () => {
    await controller.findBySnippet(10);
    expect(service.findBySnippet).toHaveBeenCalledWith(10);
  });
});