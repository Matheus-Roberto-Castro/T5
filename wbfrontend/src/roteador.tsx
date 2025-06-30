import { Component } from "react";
import BarraNavegacao from "./componentes/barraNavegacao";
import ListaCliente from "./pages/listaCliente";
import FormularioCadastroCliente from "./pages/formularioCadastroCliente";
import Produtos from "./pages/produtos";
import Servicos from "./pages/servicos";
import RegistrarConsumo from "./pages/registrarConsumo";
import Estatisticas from "./pages/estatisticas";
import Home from "./pages/home";
import { Cliente } from "./types/cliente";
import { Produto } from "./types/produto";
import { Servico } from "./types/servico";

type state = {
  tela: string;
  clientes: Cliente[];
  produtos: Produto[];
  servicos: Servico[];
};

export default class Roteador extends Component<{}, state> {
  constructor(props: {}) {
    super(props);
    this.state = {
      tela: "Home",
      clientes: [],
      produtos: [],
      servicos: [],
    };

    this.selecionarView = this.selecionarView.bind(this);
  }

  componentDidMount(): void {
    this.carregarDados();
  }

  async carregarDados() {
    try {
      const [clientesResp, produtosResp, servicosResp] = await Promise.all([
        fetch("http://localhost:3001/clientes"),
        fetch("http://localhost:3001/produtos"),
        fetch("http://localhost:3001/servicos"),
      ]);

      const [clientes, produtos, servicos] = await Promise.all([
        clientesResp.json(),
        produtosResp.json(),
        servicosResp.json(),
      ]);

      this.setState({ clientes, produtos, servicos });
    } catch (erro) {
      console.error("Erro ao carregar dados:", erro);
    }
  }

  selecionarView(novaTela: string, evento: Event) {
    evento.preventDefault();
    this.setState({ tela: novaTela });
  }

  render() {
    const { tela, clientes, produtos, servicos } = this.state;

    const barraNavegacao = (
      <BarraNavegacao
        seletorView={this.selecionarView}
        tema="purple"
        botoes={["Clientes", "Produtos", "Serviços"]}
      />
    );

    let componente;
    switch (tela) {
      case "Home":
        componente = <Home seletorView={this.selecionarView} />;
        break;
      case "Clientes":
        componente = <ListaCliente tema="lightgray" />;
        break;
      case "Cadastro":
        componente = <FormularioCadastroCliente tema="#e3f2fd" />;
        break;
      case "Produtos":
        componente = <Produtos tema="orange" />;
        break;
      case "Serviços":
        componente = <Servicos tema="orange" />;
        break;
      case "Registrar consumo":
        componente = (
          <RegistrarConsumo
            clientes={clientes}
            produtos={produtos}
            servicos={servicos}
            fetchClientes={this.carregarDados}
            tema="#e3f2fd"
          />
        );
        break;
      case "Estatisticas":
        componente = <Estatisticas />;
        break;
      default:
        componente = <Home seletorView={this.selecionarView} />;
    }

    return (
      <>
        {barraNavegacao}
        {componente}
      </>
    );
  }
}
