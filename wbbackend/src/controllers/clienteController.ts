import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getClientes = async (req: Request, res: Response) => {
  const clientes = await prisma.cliente.findMany({
    include: {
      consumoProdutos: true,
      consumoServicos: true,
    },
  });
  res.json(clientes);
};

export const createCliente = async (req: Request, res: Response) => {
  try {
    const cliente = await prisma.cliente.create({ data: req.body });
    res.status(201).json(cliente);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar cliente', detalhe: err });
  }
};

export const updateCliente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { consumoProdutos, consumoServicos, ...dadosCliente } = req.body; 
    const cliente = await prisma.cliente.update({
      where: { id },
      data: dadosCliente, 
    });
    res.json(cliente);
  } catch (err: any) { 
    console.error("Erro detalhado ao atualizar cliente:", err); 
    res.status(400).json({ erro: 'Erro ao atualizar cliente', detalhe: err.message || err });
  }
};

export const deleteCliente = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.cliente.delete({ where: { id } });
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao deletar cliente', detalhe: err });
  }
};