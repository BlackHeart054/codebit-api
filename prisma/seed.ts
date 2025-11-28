// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { fakerPT_BR as faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'PHP'];
const TAGS = ['web', 'backend', 'frontend', 'database', 'algoritmo', 'devops', 'mobile', 'security'];

async function main() {
  console.log('🌱 Iniciando o seed completo...');

  // 1. Limpar tudo (Ordem importa: Comentários -> Snippets -> Usuários)
  await prisma.comment.deleteMany();
  await prisma.snippet.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Banco limpo.');

  // 2. Senha padrão
  const password = await bcrypt.hash('123456', 10);

  // 3. Admin e Usuários
  const admin = await prisma.user.create({
    data: { email: 'dev@codebit.com', name: 'Admin Codebit', password },
  });
  
  const users = [admin];
  for (let i = 0; i < 30; i++) { // Reduzi para 30 users para ser mais rápido
    const firstName = faker.person.firstName();
    users.push(await prisma.user.create({
      data: {
        email: faker.internet.email({ firstName }).toLowerCase(),
        name: `${firstName} ${faker.person.lastName()}`,
        password,
      },
    }));
  }
  console.log(`👥 ${users.length} usuários criados.`);

  // 4. Snippets e Comentários
  let totalSnippets = 0;
  let totalComments = 0;

  for (const user of users) {
    // Cada usuário cria entre 0 e 5 snippets
    const snippetsCount = faker.number.int({ min: 0, max: 5 });
    
    for (let i = 0; i < snippetsCount; i++) {
      const snippet = await prisma.snippet.create({
        data: {
          title: faker.hacker.phrase(),
          language: faker.helpers.arrayElement(LANGUAGES),
          code: generateFakeCode(),
          description: faker.lorem.paragraph(),
          tags: faker.helpers.arrayElements(TAGS, { min: 1, max: 3 }),
          authorId: user.id,
          createdAt: faker.date.past(),
        },
      });
      totalSnippets++;

      // 5. Gerar Comentários para este snippet
      // Sorteia quantos comentários (0 a 8)
      const commentsCount = faker.number.int({ min: 0, max: 8 });
      
      for (let j = 0; j < commentsCount; j++) {
        // Sorteia um autor aleatório da lista de usuários existentes
        const randomCommenter = users[Math.floor(Math.random() * users.length)];
        
        await prisma.comment.create({
          data: {
            content: faker.helpers.arrayElement([
              "Ótimo código! Me ajudou muito.",
              "Acho que dá para otimizar a linha 2.",
              "Funciona no Windows?",
              "Muito obrigado por compartilhar!",
              "Poderia explicar melhor essa função?",
              faker.lorem.sentence()
            ]),
            userId: randomCommenter.id,
            snippetId: snippet.id,
            createdAt: faker.date.recent(),
          }
        });
        totalComments++;
      }
    }
  }

  console.log(`📝 ${totalSnippets} snippets gerados.`);
  console.log(`💬 ${totalComments} comentários gerados.`);
  console.log('✅ Seed finalizado!');
}

function generateFakeCode() {
  return `function ${faker.hacker.verb()}() { return "Codebit"; }`;
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });