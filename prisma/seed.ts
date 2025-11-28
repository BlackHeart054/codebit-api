import { PrismaClient } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { SNIPPETS_CATALOG } from './snippetsCatalog';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.comment.deleteMany();
  await prisma.snippet.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'dev@codebit.com',
      name: 'Admin Codebit',
      password
    }
  });

  const users = [admin];

  for (let i = 0; i < 30; i++) {
    const firstName = faker.person.firstName();

    users.push(await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName }).toLowerCase(),
        name: `${firstName} ${faker.person.lastName()}`,
        password
      }
    }));
  }

  let totalSnippets = 0;

  for (const user of users) {
    const snippetsCount = faker.number.int({ min: 1, max: 4 });

    for (let i = 0; i < snippetsCount; i++) {
      const language = faker.helpers.objectKey(SNIPPETS_CATALOG) as keyof typeof SNIPPETS_CATALOG;
      const snippet = faker.helpers.arrayElement(SNIPPETS_CATALOG[language]);

      await prisma.snippet.create({
        data: {
          title: snippet.title,
          language,
          code: snippet.code,
          description: snippet.description,
          tags: snippet.tags,
          authorId: user.id,
          createdAt: faker.date.past()
        }
      });

      totalSnippets++;
    }
  }

  console.log(`📝 ${totalSnippets} snippets criados.`);
  console.log('🏁 Seed finalizado.');
}

main()
  .catch(err => console.error(err))
  .finally(() => prisma.$disconnect());
