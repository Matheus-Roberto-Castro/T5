import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const getServicos = async (req: Request, res: Response) => {
  const servicos = await prisma.servico.findMany();
  res.json(servicos);
};

export const createServico = async (req: Request, res: Response) => {
  try {
    const servico = await prisma.servico.create({ data: req.body });
    res.status(201).json(servico);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao criar serviço', detalhe: err });
  }
};

export const updateServico = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const servico = await prisma.servico.update({
      where: { id },
      data: req.body,
    });
    res.json(servico);
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao atualizar serviço', detalhe: err });
  }
};

export const deleteServico = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await prisma.servico.delete({ where: { id } });
    res.json({ mensagem: 'Serviço deletado com sucesso' });
  } catch (err) {
    res.status(400).json({ erro: 'Erro ao deletar serviço', detalhe: err });
  }
};
