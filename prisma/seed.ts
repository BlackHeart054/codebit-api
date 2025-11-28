import { PrismaClient } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { SNIPPETS_CATALOG } from './snippetsCatalog';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed otimizado...');

  await prisma.comment.deleteMany();
  await prisma.snippet.deleteMany();
  await prisma.user.deleteMany();
  console.log('Dados antigos removidos.');

  const password = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'dev@codebit.com',
      name: 'Admin Codebit',
      password
    }
  });

  const users = [admin];
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    users.push(await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName }).toLowerCase(),
        name: `${firstName} ${faker.person.lastName()}`,
        password
      }
    }));
  }
  console.log(`${users.length} usuários criados.`);
  
  let totalSnippets = 0;
  let totalComments = 0;
  
  const allRealSnippets = Object.entries(SNIPPETS_CATALOG).flatMap(([lang, snippets]) => 
    snippets.map(s => ({ ...s, language: lang }))
  );

  for (const user of users) {
    const snippetsCount = faker.number.int({ min: 0, max: 3 });

    for (let i = 0; i < snippetsCount; i++) {
      const realSnippet = faker.helpers.arrayElement(allRealSnippets);

      const createdSnippet = await prisma.snippet.create({
        data: {
          title: realSnippet.title,
          language: realSnippet.language,
          code: realSnippet.code,
          description: realSnippet.description,
          tags: realSnippet.tags,
          authorId: user.id,
          createdAt: faker.date.past()
        }
      });
      totalSnippets++;

      const commentsCount = faker.number.int({ min: 0, max: 5 });
      
      for (let j = 0; j < commentsCount; j++) {
        const randomCommenter = users[Math.floor(Math.random() * users.length)];
        
        await prisma.comment.create({
          data: {
            content: faker.helpers.arrayElement([
              "Muito bom esse exemplo!",
              "Poderia explicar melhor a linha 2?",
              "Funciona perfeitamente, obrigado.",
              "Aqui deu erro de sintaxe, qual versão você usou?",
              "Salvou meu dia!",
              "Acho que dá para otimizar usando map().",
              faker.lorem.sentence()
            ]),
            userId: randomCommenter.id,
            snippetId: createdSnippet.id,
            createdAt: faker.date.recent(),
          }
        });
        totalComments++;
      }
    }
  }

  console.log(`${totalSnippets} snippets criados (com dados reais).`);
  console.log(`${totalComments} comentários gerados.`);
  console.log('Seed finalizado com sucesso!');
}

main()
  .catch(err => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());