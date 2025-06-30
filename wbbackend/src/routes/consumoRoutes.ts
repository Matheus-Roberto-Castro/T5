import { Router } from 'express';
import {
  createConsumoProduto,
  createConsumoServico,
  getConsumoProdutos,
  getConsumoServicos,
  deleteConsumoProduto
} from '../controllers/consumoController';

const router = Router();

router.post('/produtos', createConsumoProduto);
router.post('/servicos', createConsumoServico);

router.get('/produtos', getConsumoProdutos);
router.get('/servicos', getConsumoServicos); 

router.delete('/produtos/:id', deleteConsumoProduto); 

export default router;