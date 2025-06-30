import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.consumoProduto.deleteMany({});
  await prisma.consumoServico.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.produto.deleteMany({});
  await prisma.servico.deleteMany({});

  await prisma.produto.createMany({
    data: [
      {
        id: 1,
        nome: "Shampoo Fortalecedor",
        descricao: "Shampoo para fortalecimento dos fios, ideal para uso diário.",
        preco: 29.90,
        genero: "Unissex",
        imagem: "https://cdn.awsli.com.br/2/2987/produto/45489188/dgsdgsdgsg-1ptj5urzge.png"
      },
      {
        id: 2,
        nome: "Condicionador Hidratante",
        descricao: "Condicionador com ação hidratante para cabelos ressecados.",
        preco: 32.90,
        genero: "Unissex",
        imagem: "https://destro.fbitsstatic.net/img/p/condicionador-pantene-equilibrio-hidratante-150ml-84730/271287.jpg?w=500&h=500&v=202501231555&qs=ignore"
      },
      {
        id: 3,
        nome: "Pomada Modeladora",
        descricao: "Pomada de fixação forte para penteados duradouros.",
        preco: 24.50,
        genero: "Masculino",
        imagem: "https://cdn.awsli.com.br/2500x2500/2761/2761688/produto/287870401/pomada-modeladora-efeito-teia-85g-embaixador-fa6d02bd-zhbu777ljn.png"
      },
      {
        id: 4,
        nome: "Óleo de Argan",
        descricao: "Óleo nutritivo para brilho e maciez dos cabelos.",
        preco: 39.90,
        genero: "Feminino",
        imagem: "https://www.fashioncosmeticos.com.br/wp-content/uploads/2021/01/argan.png"
      },
      {
        id: 5,
        nome: "Leave-in Protetor Térmico",
        descricao: "Protetor térmico com ação desembaraçante.",
        preco: 34.90,
        genero: "Unissex",
        imagem: "https://ikesaki.vteximg.com.br/arquivos/ids/323135/Protetor-Termico-Leave-In-Wella-Professionals-Ultimate-Repair-140ml-4064666337128-1.jpg"
      },
      {
        id: 6,
        nome: "Spray Fixador",
        descricao: "Spray de fixação leve para manter o penteado por mais tempo.",
        preco: 28.00,
        genero: "Feminino",
        imagem: "https://product-data.raiadrogasil.io/images/3673924.webp"
      },
      {
        id: 7,
        nome: "Gel Capilar",
        descricao: "Gel fixador de longa duração com efeito molhado.",
        preco: 21.90,
        genero: "Masculino",
        imagem: "https://ikesaki.vteximg.com.br/arquivos/ids/238686/Gel-Fixador-Ny.-Looks-1-Media-240g-7891350034929.png"
      },
      {
        id: 8,
        nome: "Máscara de Hidratação Profunda",
        descricao: "Máscara para hidratação intensa dos cabelos.",
        preco: 44.90,
        genero: "Feminino",
        imagem: "https://cdn.dooca.store/146215/products/captura-de-tela-2024-02-13-as-133006.png?v=1707841892"
      },
      {
        id: 9,
        nome: "Shampoo Anticaspa",
        descricao: "Combate a caspa e alivia coceiras no couro cabeludo.",
        preco: 27.90,
        genero: "Masculino",
        imagem: "https://product-data.raiadrogasil.io/images/5196821.webp"
      },
      {
        id: 10,
        nome: "Creme de Pentear Cachos",
        descricao: "Definidor de cachos com ação anti-frizz.",
        preco: 33.90,
        genero: "Feminino",
        imagem: "https://product-data.raiadrogasil.io/images/3673249.webp"
      }
    ]
  });

  await prisma.servico.createMany({
    data: [
      {
        id: 1,
        nome: "Corte Masculino",
        descricao: "Corte de cabelo masculino com máquina e tesoura.",
        preco: 35.00,
        genero: "Masculino"
      },
      {
        id: 2,
        nome: "Corte Feminino",
        descricao: "Corte de cabelo feminino com lavagem e finalização.",
        preco: 60.00,
        genero: "Feminino"
      },
      {
        id: 3,
        nome: "Barba",
        descricao: "Modelagem de barba com navalha e toalha quente.",
        preco: 25.00,
        genero: "Masculino"
      },
      {
        id: 4,
        nome: "Hidratação Capilar",
        descricao: "Tratamento intensivo para hidratação dos fios.",
        preco: 50.00,
        genero: "Unissex"
      },
      {
        id: 5,
        nome: "Escova",
        descricao: "Escova com finalização lisa ou modelada.",
        preco: 45.00,
        genero: "Feminino"
      },
      {
        id: 6,
        nome: "Progressiva",
        descricao: "Alisamento capilar com produto sem formol.",
        preco: 180.00,
        genero: "Feminino"
      },
      {
        id: 7,
        nome: "Coloração",
        descricao: "Coloração completa dos fios com tonalidade à escolha.",
        preco: 120.00,
        genero: "Feminino"
      },
      {
        id: 8,
        nome: "Platinado Masculino",
        descricao: "Descoloração total e tonalização dos fios.",
        preco: 130.00,
        genero: "Masculino"
      },
      {
        id: 9,
        nome: "Luzes",
        descricao: "Mechas e luzes com papel alumínio ou touca.",
        preco: 150.00,
        genero: "Feminino"
      },
      {
        id: 10,
        nome: "Corte Infantil",
        descricao: "Corte de cabelo para crianças até 10 anos.",
        preco: 30.00,
        genero: "Unissex"
      }
    ]
  });

  await prisma.cliente.createMany({
    data: [
      { id: 1, nome: "Ana Souza", genero: "Feminino", cpf: "111.111.111-11", telefone: "(11) 90000-0001", email: "ana.souza@email.com" },
      { id: 2, nome: "Carlos Silva", genero: "Masculino", cpf: "222.222.222-22", telefone: "(11) 90000-0002", email: "carlos.silva@email.com" },
      { id: 3, nome: "Mariana Lima", genero: "Feminino", cpf: "333.333.333-33", telefone: "(11) 90000-0003", email: "mariana.lima@email.com" },
      { id: 4, nome: "Felipe Rocha", genero: "Masculino", cpf: "444.444.444-44", telefone: "(11) 90000-0004", email: "felipe.rocha@email.com" },
      { id: 5, nome: "Jéssica Mendes", genero: "Feminino", cpf: "555.555.555-55", telefone: "(11) 90000-0005", email: "jessica.mendes@email.com" },
      { id: 6, nome: "Pedro Henrique", genero: "Masculino", cpf: "666.666.666-66", telefone: "(11) 90000-0006", email: "pedro.henrique@email.com" },
      { id: 7, nome: "Larissa Almeida", genero: "Feminino", cpf: "777.777.777-77", telefone: "(11) 90000-0007", email: "larissa.almeida@email.com" },
      { id: 8, nome: "Rafael Costa", genero: "Masculino", cpf: "888.888.888-88", telefone: "(11) 90000-0008", email: "rafael.costa@email.com" },
      { id: 9, nome: "Beatriz Carvalho", genero: "Feminino", cpf: "999.999.999-99", telefone: "(11) 90000-0009", email: "beatriz.carvalho@email.com" },
      { id: 10, nome: "Lucas Martins", genero: "Masculino", cpf: "000.000.000-00", telefone: "(11) 90000-0010", email: "lucas.martins@email.com" },
      { id: 11, nome: "Isabela Ribeiro", genero: "Feminino", cpf: "123.456.789-00", telefone: "(11) 90000-0011", email: "isabela.ribeiro@email.com" },
      { id: 12, nome: "Gustavo Freitas", genero: "Masculino", cpf: "321.654.987-00", telefone: "(11) 90000-0012", email: "gustavo.freitas@email.com" },
      { id: 13, nome: "Camila Pires", genero: "Feminino", cpf: "456.789.123-00", telefone: "(11) 90000-0013", email: "camila.pires@email.com" },
      { id: 14, nome: "Thiago Alves", genero: "Masculino", cpf: "654.321.987-00", telefone: "(11) 90000-0014", email: "thiago.alves@email.com" },
      { id: 15, nome: "Vanessa Moraes", genero: "Feminino", cpf: "789.123.456-00", telefone: "(11) 90000-0015", email: "vanessa.moraes@email.com" },
      { id: 16, nome: "João Victor", genero: "Masculino", cpf: "987.654.321-00", telefone: "(11) 90000-0016", email: "joao.victor@email.com" },
      { id: 17, nome: "Luana Santos", genero: "Feminino", cpf: "147.258.369-00", telefone: "(11) 90000-0017", email: "luana.santos@email.com" },
      { id: 18, nome: "Bruno Oliveira", genero: "Masculino", cpf: "369.258.147-00", telefone: "(11) 90000-0018", email: "bruno.oliveira@email.com" },
      { id: 19, nome: "Patrícia Barros", genero: "Feminino", cpf: "741.852.963-00", telefone: "(11) 90000-0019", email: "patricia.barros@email.com" },
      { id: 20, nome: "Eduardo Azevedo", genero: "Masculino", cpf: "963.852.741-00", telefone: "(11) 90000-0020", email: "eduardo.azevedo@email.com" },
      { id: 21, nome: "Larissa Neves", genero: "Feminino", cpf: "135.792.468-00", telefone: "(11) 90000-0021", email: "larissa.neves@email.com" },
      { id: 22, nome: "Renan Duarte", genero: "Masculino", cpf: "246.813.579-00", telefone: "(11) 90000-0022", email: "renan.duarte@email.com" },
      { id: 23, nome: "Aline Fernandes", genero: "Feminino", cpf: "357.159.486-00", telefone: "(11) 90000-0023", email: "aline.fernandes@email.com" },
      { id: 24, nome: "Leonardo Prado", genero: "Masculino", cpf: "468.294.753-00", telefone: "(11) 90000-0024", email: "leonardo.prado@email.com" },
      { id: 25, nome: "Tatiane Ramos", genero: "Feminino", cpf: "579.631.842-00", telefone: "(11) 90000-0025", email: "tatiane.ramos@email.com" },
      { id: 26, nome: "Roberto Nunes", genero: "Masculino", cpf: "680.417.235-00", telefone: "(11) 90000-0026", email: "roberto.nunes@email.com" },
      { id: 27, nome: "Elaine Cardoso", genero: "Feminino", cpf: "791.548.326-00", telefone: "(11) 90000-0027", email: "elaine.cardoso@email.com" },
      { id: 28, nome: "Matheus Oliveira", genero: "Masculino", cpf: "802.653.417-00", telefone: "(11) 90000-0028", email: "matheus.oliveira@email.com" },
      { id: 29, nome: "Paula Teixeira", genero: "Feminino", cpf: "913.764.528-00", telefone: "(11) 90000-0029", email: "paula.teixeira@email.com" },
      { id: 30, nome: "Diego Gomes", genero: "Masculino", cpf: "024.875.639-00", telefone: "(11) 90000-0030", email: "diego.gomes@email.com" },
    ]
  });

  await prisma.consumoProduto.createMany({
    data: [
      { clienteId: 1, produtoId: 1, quantidade: 2 }, 
      { clienteId: 1, produtoId: 4, quantidade: 1 }, 
      { clienteId: 2, produtoId: 3, quantidade: 1 }, 
      { clienteId: 3, produtoId: 8, quantidade: 1 }, 
      { clienteId: 4, produtoId: 7, quantidade: 2 }, 
      { clienteId: 5, produtoId: 10, quantidade: 1 },
      { clienteId: 6, produtoId: 9, quantidade: 1 }, 
      { clienteId: 7, produtoId: 2, quantidade: 3 }, 
      { clienteId: 8, produtoId: 5, quantidade: 1 }, 
      { clienteId: 9, produtoId: 6, quantidade: 2 }, 
      { clienteId: 10, produtoId: 1, quantidade: 1 },
      { clienteId: 11, produtoId: 4, quantidade: 2 },
      { clienteId: 12, produtoId: 3, quantidade: 1 },
      { clienteId: 1, produtoId: 1, quantidade: 1 }, 
    ]
  });

  await prisma.consumoServico.createMany({
    data: [
      { clienteId: 1, servicoId: 2, quantidade: 1 }, 
      { clienteId: 1, servicoId: 4, quantidade: 1 }, 
      { clienteId: 2, servicoId: 1, quantidade: 1 }, 
      { clienteId: 2, servicoId: 3, quantidade: 1 }, 
      { clienteId: 3, servicoId: 5, quantidade: 1 }, 
      { clienteId: 4, servicoId: 1, quantidade: 1 }, 
      { clienteId: 5, servicoId: 2, quantidade: 1 },
      { clienteId: 6, servicoId: 3, quantidade: 1 },
      { clienteId: 7, servicoId: 4, quantidade: 2 }, 
      { clienteId: 8, servicoId: 8, quantidade: 1 }, 
      { clienteId: 9, servicoId: 9, quantidade: 1 }, 
      { clienteId: 10, servicoId: 10, quantidade: 1 },
      { clienteId: 1, servicoId: 2, quantidade: 1 }, 
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });