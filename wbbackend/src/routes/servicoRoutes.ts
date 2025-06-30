import { Router } from 'express';
import { getServicos, createServico, updateServico, deleteServico } from '../controllers/servicoController';

const router = Router();

router.get('/', getServicos);
router.post('/', createServico);
router.put('/:id', updateServico);
router.delete('/:id', deleteServico);

export default router;
