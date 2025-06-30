import { Component } from "react";
import { Produto } from "../types/produto";

type Props = {
  tema: string;
};

type ProdutoFormData = {
  nome: string;
  descricao: string;
  preco: number | string;
  genero: "Masculino" | "Feminino" | "Unissex" | "";
  imagem: string | undefined; 
};

type State = {
  produtos: Produto[];
  produtoSelecionado: Produto | null;
  modalCadastroAberto: boolean;
  modalDetalhesAberto: boolean;
  modalEdicaoAberto: boolean;
  filtroGenero: "Todos" | "Masculino" | "Feminino" | "Unissex";
  formDataCadastro: ProdutoFormData;
  formDataEdicao: ProdutoFormData | null;
  errorMessage: string;
  successMessage: string;
};

export default class Produtos extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      produtos: [],
      produtoSelecionado: null,
      modalCadastroAberto: false,
      modalDetalhesAberto: false,
      modalEdicaoAberto: false,
      filtroGenero: "Todos",
      formDataCadastro: {
        nome: "",
        descricao: "",
        preco: "",
        genero: "",
        imagem: undefined,
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

    this.handleInputChangeCadastro = this.handleInputChangeCadastro.bind(this);
    this.handleInputChangeEdicao = this.handleInputChangeEdicao.bind(this);
    this.cadastrarProduto = this.cadastrarProduto.bind(this);
    this.salvarEdicaoProduto = this.salvarEdicaoProduto.bind(this);
    this.excluirProduto = this.excluirProduto.bind(this);
    this.handleFiltroGeneroChange = this.handleFiltroGeneroChange.bind(this);
  }

  componentDidMount() {
    this.carregarProdutos();
  }

  async carregarProdutos() {
    try {
      const resposta = await fetch("http://localhost:3001/produtos");
      if (!resposta.ok) {
        throw new Error(`HTTP error! status: ${resposta.status}`);
      }
      const dados: Produto[] = await resposta.json();
      this.setState({ produtos: dados, errorMessage: "", successMessage: "" });
    } catch (erro: any) {
      console.error("Erro ao carregar produtos:", erro);
      this.setState({ errorMessage: `Erro ao carregar produtos: ${erro.message || erro}` });
    }
  }

  abrirModalDetalhes(produto: Produto) {
    this.setState({
      produtoSelecionado: produto,
      modalDetalhesAberto: true,
      errorMessage: "",
      successMessage: "",
    });
  }

  fecharModalDetalhes() {
    this.setState({ modalDetalhesAberto: false, produtoSelecionado: null });
  }

  abrirModalEdicao() {
    if (this.state.produtoSelecionado) {
      const produtoParaEdicao: ProdutoFormData = {
        ...this.state.produtoSelecionado,
        preco: String(this.state.produtoSelecionado.preco),
        imagem: this.state.produtoSelecionado.imagem || undefined 
      };
      this.setState({
        modalEdicaoAberto: true,
        modalDetalhesAberto: false,
        formDataEdicao: produtoParaEdicao, 
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
        imagem: undefined, 
      },
      errorMessage: "",
      successMessage: "",
    });
  }

  fecharModalCadastro() {
    this.setState({ modalCadastroAberto: false });
  }

  handleInputChangeCadastro = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formDataCadastro: {
        ...prevState.formDataCadastro,
        [name]: value,
      },
    }));
  };

  handleInputChangeEdicao = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formDataEdicao: prevState.formDataEdicao ? {
        ...prevState.formDataEdicao,
        [name]: value,
      } : null,
    }));
  };

  handleFiltroGeneroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ filtroGenero: event.target.value as State["filtroGenero"] });
  };

  async cadastrarProduto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { formDataCadastro } = this.state;

    const precoNumerico = parseFloat(String(formDataCadastro.preco));
    if (isNaN(precoNumerico)) {
        this.setState({ errorMessage: "Por favor, insira um preço válido." });
        return;
    }

    const produtoParaEnviar = {
      nome: formDataCadastro.nome,
      descricao: formDataCadastro.descricao,
      preco: precoNumerico,
      genero: formDataCadastro.genero === "" ? "Unissex" : formDataCadastro.genero,
      imagem: formDataCadastro.imagem || null,
    };

    try {
      const res = await fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoParaEnviar),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json();
      this.carregarProdutos();
      this.setState({
        successMessage: "Produto cadastrado com sucesso!",
        errorMessage: "",
        modalCadastroAberto: false,
        formDataCadastro: {
          nome: "",
          descricao: "",
          preco: "",
          genero: "",
          imagem: undefined, 
        },
      });
    } catch (err: any) {
      console.error("Erro ao cadastrar produto:", err);
      this.setState({ errorMessage: `Erro ao cadastrar produto: ${err.message}` });
    }
  }

  async salvarEdicaoProduto(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { produtoSelecionado, formDataEdicao } = this.state;
    if (!produtoSelecionado || !formDataEdicao) {
      this.setState({ errorMessage: "Nenhum produto selecionado para edição." });
      return;
    }

    const precoNumerico = parseFloat(String(formDataEdicao.preco));
    if (isNaN(precoNumerico)) {
        this.setState({ errorMessage: "Por favor, insira um preço válido." });
        return;
    }

    const produtoAtualizado = {
      ...formDataEdicao,
      preco: precoNumerico,
      imagem: formDataEdicao.imagem || null, 
      id: produtoSelecionado.id,
    };

    try {
      const res = await fetch(`http://localhost:3001/produtos/${produtoSelecionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json();
      this.carregarProdutos();
      this.setState({
        successMessage: "Produto atualizado com sucesso!",
        errorMessage: "",
        modalEdicaoAberto: false,
        produtoSelecionado: null,
        formDataEdicao: null,
      });
    } catch (err: any) {
      console.error("Erro ao editar produto:", err);
      this.setState({ errorMessage: `Erro ao salvar alterações: ${err.message}` });
    }
  }

  async excluirProduto() {
    const { produtoSelecionado } = this.state;
    if (!produtoSelecionado) return;

    if (!window.confirm(`Tem certeza que deseja excluir o produto ${produtoSelecionado.nome}?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/produtos/${produtoSelecionado.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json();
      this.carregarProdutos();
      this.setState({
        successMessage: "Produto excluído com sucesso!",
        errorMessage: "",
        modalDetalhesAberto: false,
        produtoSelecionado: null,
      });
    } catch (err: any) {
      console.error("Erro ao excluir produto:", err);
      this.setState({ errorMessage: `Erro ao excluir produto: ${err.message}` });
    }
  }

  filtrarProdutos() {
    const { produtos, filtroGenero } = this.state;
    if (filtroGenero === "Todos") return produtos;
    return produtos.filter((p) => p.genero === filtroGenero);
  }

  render() {
    const tema = this.props.tema;
    const {
      produtoSelecionado,
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
        <h2 className="my-4">Lista de Produtos</h2>

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
          {this.filtrarProdutos().map((produto) => (
            <div
              key={produto.id}
              className="card shadow-sm"
              style={{ width: "18rem", cursor: "pointer" }}
              onClick={() => this.abrirModalDetalhes(produto)}
            >
              <img
                src={produto.imagem || "https://via.placeholder.com/200x200?text=Sem+Imagem"}
                className="card-img-top img-fluid"
                style={{ objectFit: "cover", height: "200px" }}
                alt={produto.nome}
              />
              <div className="card-body">
                <h5 className="card-title">{produto.nome}</h5>
                <p className="card-text">{produto.descricao}</p>
                <p className="fw-bold">R$ {produto.preco.toFixed(2)}</p>
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

        {modalDetalhesAberto && produtoSelecionado && (
          <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{produtoSelecionado.nome}</h5>
                  <button className="btn-close" onClick={this.fecharModalDetalhes}></button>
                </div>
                <div className="modal-body">
                  <img
                    src={produtoSelecionado.imagem || "https://via.placeholder.com/300x200?text=Sem+Imagem"}
                    alt={produtoSelecionado.nome}
                    className="img-fluid mb-3"
                  />
                  <p>
                    <strong>ID:</strong> {produtoSelecionado.id}
                  </p>
                  <p>
                    <strong>Descrição:</strong> {produtoSelecionado.descricao}
                  </p>
                  <p>
                    <strong>Preço:</strong> R$ {produtoSelecionado.preco.toFixed(2)}
                  </p>
                  <p>
                    <strong>Gênero:</strong> {produtoSelecionado.genero}
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={this.excluirProduto}>
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
                <form onSubmit={this.salvarEdicaoProduto}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <input
                        className="form-control"
                        name="nome"
                        value={formDataEdicao.nome}
                        onChange={this.handleInputChangeEdicao}
                        placeholder="Nome do Produto"
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
                    <div className="mb-3">
                      <input
                        className="form-control"
                        name="imagem"
                        value={formDataEdicao.imagem || ''} 
                        onChange={this.handleInputChangeEdicao}
                        placeholder="URL da Imagem (opcional)"
                      />
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
                  <h5 className="modal-title">Cadastrar Produto</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={this.fecharModalCadastro}
                  ></button>
                </div>
                <form onSubmit={this.cadastrarProduto}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <input
                        className="form-control"
                        name="nome"
                        value={formDataCadastro.nome}
                        onChange={this.handleInputChangeCadastro}
                        placeholder="Nome do Produto"
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
                    <div className="mb-3">
                      <input
                        className="form-control"
                        name="imagem"
                        value={formDataCadastro.imagem || ''} 
                        onChange={this.handleInputChangeCadastro}
                        placeholder="URL da Imagem (opcional)"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-success">
                      Cadastrar
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={this.fecharModalCadastro}
                    >
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