import { Component } from "react";

type ClienteFormData = {
  nome: string;
  sobrenome: string; 
  cpf: string;
  telefone: string;
  genero: string;
  email: string;
};

type Props = {
  tema: string;
};

type State = {
  formData: ClienteFormData;
  errorMessage: string;
  successMessage: string;
};

export default class FormularioCadastroCliente extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formData: {
        nome: "",
        sobrenome: "",
        cpf: "",
        telefone: "",
        genero: "",
        email: "",
      },
      errorMessage: "",
      successMessage: "",
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
      errorMessage: "", 
      successMessage: "", 
    }));
  };

  handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { formData } = this.state;

    if (!formData.nome || !formData.cpf || !formData.genero || !formData.email || !formData.telefone) {
      this.setState({ errorMessage: "Por favor, preencha todos os campos obrigatórios." });
      return;
    }

    const nomeCompleto = `${formData.nome} ${formData.sobrenome}`.trim();

    const clienteParaEnviar = {
      nome: nomeCompleto,
      genero: formData.genero,
      cpf: formData.cpf,
      telefone: formData.telefone,
      email: formData.email,
    };

    try {
      const res = await fetch("http://localhost:3001/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteParaEnviar),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.erro || `Erro HTTP! status: ${res.status}`);
      }

      await res.json(); 

      this.setState({
        successMessage: "Cliente cadastrado com sucesso!",
        errorMessage: "",
        formData: { 
          nome: "",
          sobrenome: "",
          cpf: "",
          telefone: "",
          genero: "",
          email: "",
        },
      });
    } catch (err: any) {
      console.error("Erro ao cadastrar cliente:", err);
      this.setState({ errorMessage: `Erro ao cadastrar cliente: ${err.message}` });
    }
  };

  render() {
    let tema = this.props.tema;
    const { formData, errorMessage, successMessage } = this.state;

    return (
      <div className="container card shadow my-4">
        <span className="pt-4 px-4 h3">Cadastro de cliente</span>
        <div className="container-fluid p-4">
          <form onSubmit={this.handleSubmit}>
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

            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nome"
                  name="nome" 
                  value={formData.nome} 
                  onChange={this.handleInputChange}
                  required 
                />
              </div>
              <div className="col-md-6 mt-3 mt-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Sobrenome"
                  name="sobrenome"
                  value={formData.sobrenome}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="CPF (000.000.000-00)"
                  name="cpf" 
                  value={formData.cpf} 
                  onChange={this.handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mt-3 mt-md-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Telefone (99) 99999-9999"
                  name="telefone"
                  value={formData.telefone}
                  onChange={this.handleInputChange} 
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <select
                className="form-select"
                name="genero" 
                value={formData.genero} 
                onChange={this.handleInputChange}
                required
              >
                <option value="">Selecione o gênero</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <div className="mb-3 input-group">
              <span
                className="input-group-text"
                style={{ background: tema }}
              >
                @
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="E-mail"
                name="email"
                value={formData.email} 
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-outline-secondary"
                type="submit"
                style={{ background: tema }}
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}