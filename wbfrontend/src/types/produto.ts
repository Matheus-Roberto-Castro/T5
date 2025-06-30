export type Produto = {
  id: number
  nome: string
  descricao: string
  preco: number
  genero: "Masculino" | "Feminino" | "Unissex"
  imagem?: string
}