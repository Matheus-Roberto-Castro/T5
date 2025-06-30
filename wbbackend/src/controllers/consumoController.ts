import { Request, Response } from 'express';
import prisma from '../prisma/client';

export const createConsumoProduto = async (req: Request, res: Response) => {
  try {
    const { clienteId, produtoId, quantidade } = req.body;
    const consumoProduto = await prisma.consumoProduto.create({
      data: {
        cliente: { connect: { id: clienteId } },
        produto: { connect: { id: produtoId } },
        quantidade: quantidade,
      },
    });
    res.status(201).json(consumoProduto);
  } catch (err: any) {
    console.error("Erro ao criar ConsumoProduto:", err);
    res.status(400).json({ erro: 'Erro ao registrar consumo de produto', detalhe: err.message || err });
  }
};

export const createConsumoServico = async (req: Request, res: Response) => {
  try {
    const { clienteId, servicoId, quantidade } = req.body;
    const consumoServico = await prisma.consumoServico.create({
      data: {
        cliente: { connect: { id: clienteId } },
        servico: { connect: { id: servicoId } },
        quantidade: quantidade,
      },
    });
    res.status(201).json(consumoServico);
  } catch (err: any) {
    console.error("Erro ao criar ConsumoServico:", err);
    res.status(400).json({ erro: 'Erro ao registrar consumo de serviço', detalhe: err.message || err });
  }
};

export const getConsumoProdutos = async (req: Request, res: Response) => {
  try {
    const consumos = await prisma.consumoProduto.findMany({
      include: { cliente: true, produto: true },
    });
    res.json(consumos);
  } catch (err: any) {
    res.status(500).json({ erro: 'Erro ao buscar consumos de produtos', detalhe: err.message || err });
  }
};

export const getConsumoServicos = async (req: Request, res: Response) => {
  try {
    const consumos = await prisma.consumoServico.findMany({
      include: { cliente: true, servico: true },
    });
    res.json(consumos);
  } catch (err: any) {
    res.status(500).json({ erro: 'Erro ao buscar consumos de serviços', detalhe: err.message || err });
  }
};

export const deleteConsumoProduto = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await prisma.consumoProduto.delete({ where: { id } });
        res.json({ mensagem: 'Consumo de produto deletado com sucesso' });
    } catch (err) {
        res.status(400).json({ erro: 'Erro ao deletar consumo de produto', detalhe: err });
    }
};