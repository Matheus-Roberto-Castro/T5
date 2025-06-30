import { Component } from "react";
import { Servico } from "../types/servico";

type ServicoFormData = {
  nome: string;
  descricao: string;
  preco: number | string; 
  genero: "Masculino" | "Feminino" | "Unissex" | "";
};

type Props = {
  tema: string;
};

type State = {
  servicos: Servico[];
  servicoSelecionado: Servico | null; 
  modalCadastroAberto: boolean;
  modalDetalhesAberto: boolean;
  modalEdicaoAberto: boolean;
  filtroGenero: "Todos" | "Masculino" | "Feminino" | "Unissex";
  formDataCadastro: ServicoFormData; 
  formDataEdicao: ServicoFormData | null; 
  errorMessage: string; 
  successMessage: string;
};

export default class Servicos extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      servicos: [],
      servicoSelecionado: null,
      modalCadastroAberto: false,
      modalDetalhesAberto: false,
      modalEdicaoAberto: false,
      filtroGenero: "Todos",
      formDataCadastro: {
        nome: "",
        descricao: "",
        preco: "", 
        genero: "", 
      },
      formDataEdicao: null,
      errorMessage: "",
      successMessage: "",
    };

    this.abrirModalDetalhes = this.abrirModalDetalhes.bind(this);
    this.fecharModalDetalhes = this.fecharModalDetalhes.bind(this);
    this.abrirModalCadastro = this.abrirModalCadastro.bind(this);
    this.fecharModalCadastro = this.fecharModalCadastro.bind(this);
    this.abrirModalEdicao = this.abrirModalEdicao.bind(this);
    this.fecharModalEdicao = this.fecharModalEdicao.bind(this);
    this.handleFiltroGeneroChange = this.handleFiltroGeneroChange.bind(this); 
    this.handleInputChangeCadastro = this.handleInputChangeCadastro.bind(this);
    this.handleInputChangeEdicao = this.handleInputChangeEdicao.bind(this);
    this.cadastrarServico = this.cadastrarServico.bind(this);
    this.salvarEdicaoServico = this.salvarEdicaoServico.bind(this);
    this.excluirServico = this.excluirServico.bind(this);
  }

  componentDidMount() {
    this.carregarServicos();
  }

  async carregarServicos() {
    try {
      const resposta = await fetch("http://localhost:3001/servicos");
      if (!resposta.ok) {
        throw new Error(`HTTP error! status: ${resposta.status}`);
      }
      const dados: Servico[] = await resposta.json();
      this.setState({ servicos: dados, errorMessage: "", successMessage: "" });
    } catch (erro: any) {
      console.error("Erro ao carregar serviços:", erro);
      this.setState({ errorMessage: `Erro ao carregar serviços: ${erro.message || erro}` });
    }
  }

  abrirModalDetalhes(servico: Servico) {
    this.setState({
      servicoSelecionado: servico,
      modalDetalhesAberto: true,
      errorMessage: "",
      successMessage: "",
    });
  }

  fecharModalDetalhes() {
    this.setState({ modalDetalhesAberto: false, servicoSelecionado: null });
  }

  abrirModalEdicao() {
    if (this.state.servicoSelecionado) {
      const servicoParaEdicao: ServicoFormData = {
        ...this.state.servicoSelecionado,
        preco: String(this.state.servicoSelecionado.preco),
      };
      this.setState({
        modalEdicaoAberto: true,
        modalDetalhesAberto: false, 
        formDataEdicao: servicoParaEdicao, 
        errorMessage: "",
        successMessage: "",
      });
    }
  }

  fecharModalEdicao() {
    this.setState({ modalEdicaoAberto: false, formDataEdicao: null });
  }

  abrirModalCadastro() {
    this.setState({
      modalCadastroAberto: true,
      formDataCadastro: {
        nome: "",
        descricao: "",
        preco: "", 
        genero: "", 
      },
      errorMessage: "",
      successMessage: "",
    });
  }

  fecharModalCadastro() {
    this.setState({ modalCadastroAberto: false });
  }

  handleInputChangeCadastro(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formDataCadastro: {
        ...prevState.formDataCadastro,
        [name]: value,
      },
    }));
  }

  handleInputChangeEdicao(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formDataEdicao: prevState.formDataEdicao
        ? {
            ...prevState.formDataEdicao,
            [name]: value,
          }
        : null,
    }));
  }

  handleFiltroGeneroChange(event: React.ChangeEvent<HTMLSelectElement>) {
    this.setState({ filtroGenero: event.target.value as State["filtroGenero"] });
  }

  async cadastrarServico(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 

    const { formDataCadastro } = this.state;

    const precoNumerico = parseFloat(String(formDataCadastro.preco));
    if (isNaN(precoNumerico)) {
      this.setState({ errorMessage: "Por favor, insira um preço válido para o serviço." });
      return;
    }

    const servicoParaEnviar = {
      nome: formDataCadastro.nome,
      descricao: formDataCadastro.descricao,
      preco: precoNumerico,
      genero: formDataCadastro.genero === "" ? "Unissex" : formDataCadastro.genero, 
    };

    try {
      const res = await fetch("http://localhost:3001/servicos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicoParaEnviar),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json();
      this.carregarServicos(); 
      this.setState({
        successMessage: "Serviço cadastrado com sucesso!",
        errorMessage: "",
        modalCadastroAberto: false,
        formDataCadastro: {
          nome: "",
          descricao: "",
          preco: "",
          genero: "",
        },
      });
    } catch (err: any) {
      console.error("Erro ao cadastrar serviço:", err);
      this.setState({ errorMessage: `Erro ao cadastrar serviço: ${err.message || err}` });
    }
  }

  async salvarEdicaoServico(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); 

    const { servicoSelecionado, formDataEdicao } = this.state;
    if (!servicoSelecionado || !formDataEdicao) {
      this.setState({ errorMessage: "Nenhum serviço selecionado para edição." });
      return;
    }

    const precoNumerico = parseFloat(String(formDataEdicao.preco));
    if (isNaN(precoNumerico)) {
      this.setState({ errorMessage: "Por favor, insira um preço válido para o serviço." });
      return;
    }

    const servicoAtualizado = {
      ...formDataEdicao,
      preco: precoNumerico,
      id: servicoSelecionado.id, 
    };

    try {
      const res = await fetch(`http://localhost:3001/servicos/${servicoSelecionado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(servicoAtualizado),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json(); 
      this.carregarServicos(); 
      this.setState({
        successMessage: "Serviço atualizado com sucesso!",
        errorMessage: "",
        modalEdicaoAberto: false,
        servicoSelecionado: null,
        formDataEdicao: null,
      });
    } catch (err: any) {
      console.error("Erro ao editar serviço:", err);
      this.setState({ errorMessage: `Erro ao salvar alterações: ${err.message || err}` });
    }
  }

  async excluirServico() {
    const { servicoSelecionado } = this.state;
    if (!servicoSelecionado) return;

    if (!window.confirm(`Tem certeza que deseja excluir o serviço "${servicoSelecionado.nome}"?`)) {
      return; 
    }

    try {
      const res = await fetch(`http://localhost:3001/servicos/${servicoSelecionado.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json(); 
      this.carregarServicos(); 
      this.setState({
        successMessage: "Serviço excluído com sucesso!",
        errorMessage: "",
        modalDetalhesAberto: false, 
        servicoSelecionado: null,
      });
    } catch (err: any) {
      console.error("Erro ao excluir serviço:", err);
      this.setState({ errorMessage: `Erro ao excluir serviço: ${err.message || err}` });
    }
  }

  filtrarServicos() {
    const { servicos, filtroGenero } = this.state;
    if (filtroGenero === "Todos") return servicos;
    return servicos.filter((s) => s.genero === filtroGenero);
  }

  render() {
    const tema = this.props.tema;
    const {
      servicoSelecionado,
      modalDetalhesAberto,
      modalEdicaoAberto,
      modalCadastroAberto,
      formDataCadastro,
      formDataEdicao,
      errorMessage,
      successMessage,
    } = this.state;

    return (
      <div className="container">
        <h2 className="my-4">Lista de Serviços</h2>

        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

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
            <option value="Unissex">Unissex</option>
          </select>
        </div>

        <div className="d-flex flex-wrap gap-4">
          {this.filtrarServicos().map((servico) => (
            <div
              key={servico.id}
              className="card shadow-sm"
              style={{ width: "15rem", cursor: "pointer", fontSize: "0.9rem" }}
              onClick={() => this.abrirModalDetalhes(servico)}
            >
              <div className="card-body">
                <h6 className="card-title fw-semibold">{servico.nome}</h6>
                <p className="card-text" style={{ fontSize: "0.85rem" }}>
                  {servico.descricao}
                </p>
                <p className="fw-bold">R$ {servico.preco.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn rounded-circle shadow"
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            backgroundColor: tema,
            color: "white",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
          onClick={this.abrirModalCadastro}
        >
          <i className="bi bi-plus-lg" style={{ fontSize: "1.75rem" }}></i>
        </button>

        {modalDetalhesAberto && servicoSelecionado && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{servicoSelecionado.nome}</h5>
                  <button className="btn-close" onClick={this.fecharModalDetalhes}></button>
                </div>
                <div className="modal-body">
                  <p>
                    <strong>ID:</strong> {servicoSelecionado.id}
                  </p>
                  <p>
                    <strong>Descrição:</strong> {servicoSelecionado.descricao}
                  </p>
                  <p>
                    <strong>Preço:</strong> R$ {servicoSelecionado.preco.toFixed(2)}
                  </p>
                  <p>
                    <strong>Gênero:</strong> {servicoSelecionado.genero}
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={this.excluirServico}>
                    Excluir
                  </button>
                  <button className="btn btn-secondary" onClick={this.abrirModalEdicao}>
                    Editar
                  </button>
                  <button className="btn btn-outline-secondary" onClick={this.fecharModalDetalhes}>
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalEdicaoAberto && formDataEdicao && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar {formDataEdicao.nome}</h5>
                  <button className="btn-close" onClick={this.fecharModalEdicao}></button>
                </div>
                <form onSubmit={this.salvarEdicaoServico}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <input
                        className="form-control"
                        name="nome"
                        value={formDataEdicao.nome}
                        onChange={this.handleInputChangeEdicao}
                        placeholder="Nome do Serviço"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        name="descricao"
                        value={formDataEdicao.descricao}
                        onChange={this.handleInputChangeEdicao}
                        placeholder="Descrição"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        type="number"
                        name="preco"
                        value={formDataEdicao.preco}
                        onChange={this.handleInputChangeEdicao}
                        placeholder="Preço (R$)"
                        step="0.01"
                      />
                    </div>
                    <div className="mb-3">
                      <select
                        className="form-select"
                        name="genero"
                        value={formDataEdicao.genero}
                        onChange={this.handleInputChangeEdicao}
                      >
                        <option value="">Selecione o gênero</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Unissex">Unissex</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">
                      Salvar
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={this.fecharModalEdicao}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {modalCadastroAberto && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex={-1}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Cadastrar Serviço</h5>
                  <button type="button" className="btn-close" onClick={this.fecharModalCadastro}></button>
                </div>
                <form onSubmit={this.cadastrarServico}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <input
                        className="form-control"
                        name="nome"
                        value={formDataCadastro.nome}
                        onChange={this.handleInputChangeCadastro}
                        placeholder="Nome do Serviço"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        name="descricao"
                        value={formDataCadastro.descricao}
                        onChange={this.handleInputChangeCadastro}
                        placeholder="Descrição"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <input
                        className="form-control"
                        placeholder="Preço (R$)"
                        type="number"
                        name="preco"
                        value={formDataCadastro.preco}
                        onChange={this.handleInputChangeCadastro}
                        step="0.01" 
                      />
                    </div>
                    <div className="mb-3">
                      <select
                        className="form-select"
                        name="genero"
                        value={formDataCadastro.genero}
                        onChange={this.handleInputChangeCadastro}
                      >
                        <option value="">Selecione o gênero</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Unissex">Unissex</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">
                      Cadastrar
                    </button>
                    <button type="button" className="btn btn-outline-secondary" onClick={this.fecharModalCadastro}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}