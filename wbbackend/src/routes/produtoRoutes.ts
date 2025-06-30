import { Router } from 'express';
import { getProdutos, createProduto, updateProduto, deleteProduto } from '../controllers/produtoController';

const router = Router();

router.get('/', getProdutos);
router.post('/', createProduto);
router.put('/:id', updateProduto);
router.delete('/:id', deleteProduto);

export default router;
