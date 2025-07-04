import { Router } from 'express';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../controllers/clienteController';

const router = Router();

router.get('/', getClientes);
router.post('/', createCliente);
router.put('/:id', updateCliente);
router.delete('/:id', deleteCliente);

export default router;
