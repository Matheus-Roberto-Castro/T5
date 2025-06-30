import { ConsumoProduto } from "./consumos";
import { ConsumoServico } from "./consumos";

export type Cliente = {
  id: number;
  nome: string;
  genero: "Masculino" | "Feminino" | "Outro";
  cpf: string;
  telefone: string;
  email: string
  consumoProdutos: ConsumoProduto[];
  consumoServicos: ConsumoServico[];
};