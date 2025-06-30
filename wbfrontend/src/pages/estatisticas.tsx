import { Component, ChangeEvent } from "react";
import {
  BarChart, Bar, Rectangle, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Cliente } from "../types/cliente";
import { Produto } from "../types/produto";
import { Servico } from "../types/servico";

type State = {
  generoSelecionado: string;
  clientes: Cliente[];
  produtos: Produto[];
  servicos: Servico[];
};

export default class Estatisticas extends Component<{}, State> {
  state: State = {
    generoSelecionado: "Feminino",
    clientes: [],
    produtos: [],
    servicos: [],
  };

  componentDidMount(): void {
    this.carregarDados();
  }

  async carregarDados() {
    try {
      const [clientesResp, produtosResp, servicosResp] = await Promise.all([
        fetch("http://localhost:3001/clientes"),
        fetch("http://localhost:3001/produtos"),
        fetch("http://localhost:3001/servicos")
      ]);

      const [clientes, produtos, servicos] = await Promise.all([
        clientesResp.json(),
        produtosResp.json(),
        servicosResp.json()
      ]);

      this.setState({ clientes, produtos, servicos });
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
    }
  }

  handleGeneroChange = (event: ChangeEvent<HTMLSelectElement>) => {
    this.setState({ generoSelecionado: event.target.value });
  };

  calcularTopClientesQuantidade() {
    const lista = this.state.clientes.map(c => ({
      nome: c.nome,
      quantidade: [...c.consumoProdutos, ...c.consumoServicos]
        .reduce((soma, item) => soma + item.quantidade, 0)
    }));
    return lista.sort((a, b) => b.quantidade - a.quantidade).slice(0, 10);
  }

  calcularTopClientesValor() {
    const { clientes, produtos, servicos } = this.state;
    const lista = clientes.map(c => {
      const valorProdutos = c.consumoProdutos.reduce((soma, cp) => {
        const p = produtos.find(p => p.id === cp.produtoId);
        return soma + (p ? p.preco * cp.quantidade : 0);
      }, 0);

      const valorServicos = c.consumoServicos.reduce((soma, cs) => {
        const s = servicos.find(s => s.id === cs.servicoId);
        return soma + (s ? s.preco * cs.quantidade : 0);
      }, 0);

      return { nome: c.nome, valor: parseFloat((valorProdutos + valorServicos).toFixed(2)) };
    });

    return lista.sort((a, b) => b.valor - a.valor).slice(0, 5);
  }

  calcularMenoresClientesQuantidade() {
    const lista = this.state.clientes.map(c => ({
      nome: c.nome,
      quantidade: [...c.consumoProdutos, ...c.consumoServicos]
        .reduce((soma, item) => soma + item.quantidade, 0)
    }));
    return lista.sort((a, b) => a.quantidade - b.quantidade).slice(0, 10);
  }

  calcularConsumoPorGenero(genero: string) {
    const { clientes, produtos, servicos } = this.state;
    const filtrados = genero === "Todos"
      ? clientes
      : clientes.filter(c => c.genero === genero);

    const mapa: { [nome: string]: number } = {};

    filtrados.forEach(c => {
      c.consumoProdutos.forEach(cp => {
        const p = produtos.find(p => p.id === cp.produtoId);
        if (p) mapa[p.nome] = (mapa[p.nome] || 0) + cp.quantidade;
      });
      c.consumoServicos.forEach(cs => {
        const s = servicos.find(s => s.id === cs.servicoId);
        if (s) mapa[s.nome] = (mapa[s.nome] || 0) + cs.quantidade;
      });
    });

    return Object.entries(mapa).map(([nome, quantidade]) => ({ nome, quantidade }));
  }

  render() {
    const topQuantidade = this.calcularTopClientesQuantidade();
    const topValor = this.calcularTopClientesValor();
    const menores = this.calcularMenoresClientesQuantidade();
    const porGenero = this.calcularConsumoPorGenero(this.state.generoSelecionado);

    return (
      <div className="container">
        <h3 className="mb-4">Estatísticas de Consumo</h3>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Top 10 Clientes por Quantidade</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topQuantidade}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#4e73df" activeBar={<Rectangle fill="#2e59d9" stroke="#4e73df" />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Top 5 Clientes por Valor</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topValor}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor" fill="#1cc88a" activeBar={<Rectangle fill="#17a673" stroke="#1cc88a" />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">10 Clientes que Menos Consumiram</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={menores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#f6c23e" activeBar={<Rectangle fill="#dda20a" stroke="#f6c23e" />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">Consumo por Gênero</h5>
                  <select className="form-select form-select-sm w-auto" value={this.state.generoSelecionado} onChange={this.handleGeneroChange}>
                    <option value="Todos">Todos</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={porGenero}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade" fill="#36b9cc" activeBar={<Rectangle fill="#2c9faf" stroke="#36b9cc" />} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
