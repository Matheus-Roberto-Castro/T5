import { Component } from "react";
import { Cliente } from "../types/cliente"; 

type Props = {
  tema: string;
};

type State = {
  clienteSelecionado: Cliente | null;
  clientes: Cliente[];
  edicao: boolean;
  filtroGenero: "Todos" | "Masculino" | "Feminino" | "Outro";
  errorMessage: string; 
};

export default class ListaCliente extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      clienteSelecionado: null,
      clientes: [],
      edicao: false,
      filtroGenero: "Todos",
      errorMessage: "",
    };
  }

  componentDidMount() {
    this.carregarClientes();
  }

  carregarClientes = async () => {
    try {
      const res = await fetch("http://localhost:3001/clientes");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Cliente[] = await res.json();
      this.setState({ clientes: data, errorMessage: "" });
    } catch (err) {
      console.error("Erro ao buscar clientes:", err);
      this.setState({ errorMessage: "Erro ao carregar clientes." });
    }
  };

  abrirModal = (cliente: Cliente) => {
    this.setState({ clienteSelecionado: { ...cliente }, edicao: false, errorMessage: "" });
  };

  fecharModal = () => {
    this.setState({ clienteSelecionado: null, edicao: false, errorMessage: "" });
  };

  abrirModalEdicao = () => {
    this.setState({ edicao: true, errorMessage: "" });
  };

  fecharModalEdicao = () => {
    this.setState({ edicao: false });
    if (this.state.clienteSelecionado) {
      this.setState({ clienteSelecionado: null });
    }
  };

  handleFiltroGeneroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ filtroGenero: event.target.value as State["filtroGenero"] });
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      clienteSelecionado: {
        ...prevState.clienteSelecionado!,
        [name]: value,
      },
    }));
  };

  salvarEdicao = async () => {
    const { clienteSelecionado } = this.state;
    if (!clienteSelecionado) {
      this.setState({ errorMessage: "Nenhum cliente selecionado para edição." });
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/clientes/${clienteSelecionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteSelecionado),
      });

      if (!res.ok) {
        const errorData = await res.json(); 
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json(); 
      this.carregarClientes(); 
      this.setState({ edicao: false, clienteSelecionado: null, errorMessage: "" }); 
    } catch (err: any) {
      console.error("Erro ao editar cliente:", err);
      this.setState({ errorMessage: `Erro ao salvar alterações: ${err.message}` });
    }
  };

  excluirCliente = async () => {
    const { clienteSelecionado } = this.state;
    if (!clienteSelecionado) {
      this.setState({ errorMessage: "Nenhum cliente selecionado para exclusão." });
      return;
    }

    if (!window.confirm(`Tem certeza que deseja excluir o cliente ${clienteSelecionado.nome}?`)) {
      return; 
    }

    try {
      const res = await fetch(`http://localhost:3001/clientes/${clienteSelecionado.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json(); 
      this.carregarClientes(); 
      this.setState({ clienteSelecionado: null, errorMessage: "" });
    } catch (err: any) {
      console.error("Erro ao excluir cliente:", err);
      this.setState({ errorMessage: `Erro ao excluir cliente: ${err.message}` });
    }
  };

  filtrarClientes() {
    const { clientes, filtroGenero } = this.state;
    if (filtroGenero === "Todos") return clientes;
    return clientes.filter((c) => c.genero === filtroGenero);
  }

  render() {
    const { tema } = this.props;
    const { clienteSelecionado, edicao, errorMessage } = this.state;

    return (
      <div className="container">
        <div className="mb-3">
          <label className="form-label">Filtrar por gênero:</label>
          <select
            className="form-select form-select-sm w-25"
            value={this.state.filtroGenero}
            onChange={this.handleFiltroGeneroChange}
          >
            <option value="Todos">Todos</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        <div className="list-group">
          {this.filtrarClientes().map((cliente) => (
            <a
              key={cliente.id}
              className="list-group-item list-group-item-action d-flex justify-content-between align-items-center shadow-sm rounded mb-2"
              style={{ backgroundColor: tema }}
              onClick={() => this.abrirModal(cliente)}
            >
              <div>
                <strong>{cliente.nome}</strong> <br />
                <small>
                  CPF: {cliente.cpf} | Gênero: {cliente.genero}
                </small>
              </div>
              <i className="bi bi-chevron-right"></i>
            </a>
          ))}
        </div>

        {/* Modal de detalhes */}
        {clienteSelecionado && !edicao && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{clienteSelecionado.nome}</h5>
                  <button className="btn-close" onClick={this.fecharModal}></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>ID:</strong> {clienteSelecionado.id}
                  </p>
                  <p>
                    <strong>CPF:</strong> {clienteSelecionado.cpf}
                  </p>
                  <p>
                    <strong>Email:</strong> {clienteSelecionado.email}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {clienteSelecionado.telefone}
                  </p>
                  <p>
                    <strong>Gênero:</strong> {clienteSelecionado.genero}
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={this.excluirCliente}>
                    Excluir
                  </button>
                  <button className="btn btn-secondary" onClick={this.abrirModalEdicao}>
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edição */}
        {clienteSelecionado && edicao && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar {clienteSelecionado.nome}</h5>
                  <button className="btn-close" onClick={this.fecharModalEdicao}></button>
                </div>
                <div className="modal-body">
                  <input
                    name="nome"
                    className="form-control mb-2"
                    value={clienteSelecionado.nome}
                    onChange={this.handleInputChange}
                    placeholder="Nome"
                  />
                  <input
                    name="cpf"
                    className="form-control mb-2"
                    value={clienteSelecionado.cpf}
                    onChange={this.handleInputChange}
                    placeholder="CPF"
                  />
                  <input
                    name="email"
                    className="form-control mb-2"
                    value={clienteSelecionado.email}
                    onChange={this.handleInputChange}
                    placeholder="Email"
                  />
                  <input
                    name="telefone"
                    className="form-control mb-2"
                    value={clienteSelecionado.telefone}
                    onChange={this.handleInputChange}
                    placeholder="Telefone"
                  />
                  <select
                    name="genero"
                    className="form-select mb-2"
                    value={clienteSelecionado.genero}
                    onChange={this.handleInputChange}
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-success" onClick={this.salvarEdicao}>
                    Salvar
                  </button>
                  <button className="btn btn-outline-secondary" onClick={this.fecharModalEdicao}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}