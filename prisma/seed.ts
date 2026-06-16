import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seed do banco de dados...');

  // 1. Criar um Curso de teste
  const curso = await prisma.curso.create({
    data: {
      nome: 'Análise e Desenvolvimento de Sistemas',
    },
  });
  console.log(`Curso criado: ${curso.nome} (ID: ${curso.id})`);

  // 2. Criar uma Área de Atividade de teste
  const area = await prisma.areaAtividade.create({
    data: {
      nome: 'Pesquisa e Inovação',
      limiteHorasArea: 40.0,
    },
  });
  console.log(`Área criada: ${area.nome} (ID: ${area.id})`);

  // 3. Criar uma Subcategoria vinculada à Área acima
  const subcategoria = await prisma.subcategoria.create({
    data: {
      nome: 'Iniciação Científica',
      areaId: area.id,
    },
  });
  console.log(`Subcategoria criada: ${subcategoria.nome} (ID: ${subcategoria.id})`);

  // 4. Buscar um aluno existente para vincular ao curso (opcional, mas ajuda nos testes)
  const aluno = await prisma.user.findFirst({
    where: { role: 'ALUNO' },
  });

  if (aluno) {
    await prisma.usuariosCursos.create({
      data: {
        usuarioId: aluno.id,
        cursoId: curso.id,
        matricula: "20260001", // Número de matrícula fictício para teste
      },
    });
    console.log(`🔗 Aluno ${aluno.nome} vinculado ao curso de ${curso.nome}!`);
  } else {
    console.log('⚠️ Nenhum aluno encontrado para vincular ao curso no momento.');
  }

  console.log('🏁 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao rodar o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });