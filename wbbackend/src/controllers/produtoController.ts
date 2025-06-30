import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getProdutos = async (req: Request, res: Response) => {
  const produtos = await prisma.produto.findMany();
  res.json(produtos);
};

export const createProduto = async (req: Request, res: Response) => {
  try {
    const produto = await prisma.produto.create({ data: req.body });
    res.status(201).json(produto);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar produto', detalhe: err });
  }
};

export const updateProduto = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const produto = await prisma.produto.update({
      where: { id },
      data: req.body,
    });
    res.json(produto);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar produto', detalhe: err });
  }
};

export const deleteProduto = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.produto.delete({ where: { id } });
    res.json({ mensagem: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao deletar produto', detalhe: err });
  }
};
