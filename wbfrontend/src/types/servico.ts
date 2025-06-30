export type Servico = {
  id: number
  nome: string
  descricao: string
  preco: number
  genero: "Masculino" | "Feminino" | "Unissex"
}