import express from 'express';
import cors from 'cors';

import clienteRoutes from './routes/clienteRoutes';
import produtoRoutes from './routes/produtoRoutes';
import servicoRoutes from './routes/servicoRoutes';
import consumoRoutes from './routes/consumoRoutes'; 

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.use('/clientes', clienteRoutes);
app.use('/produtos', produtoRoutes);
app.use('/servicos', servicoRoutes);
app.use('/consumos', consumoRoutes);

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});
