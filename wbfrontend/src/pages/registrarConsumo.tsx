import { Component, ChangeEvent, FormEvent } from "react";
import { Cliente } from "../types/cliente";
import { ConsumoProduto, ConsumoServico } from "../types/consumos";
import { Produto } from "../types/produto";
import { Servico } from "../types/servico";

type ConsumoFormData = {
  clienteId: number | "";
  produtos: { id: number; quantidade: number }[];
  servicos: { id: number; quantidade: number }[];
};

type Props = {
  tema: string;
  clientes: Cliente[];
  produtos: Produto[];
  servicos: Servico[];
  onConsumoRegistrado?: () => void;
  fetchClientes: () => void; 
};

type State = {
  formData: ConsumoFormData;
  errorMessage: string;
  successMessage: string;
};

export default class RegistrarConsumo extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formData: {
        clienteId: "",
        produtos: [],
        servicos: [],
      },
      errorMessage: "",
      successMessage: "",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleQuantidadeChange = this.handleQuantidadeChange.bind(this);
    this.registrarConsumo = this.registrarConsumo.bind(this);
  }

  handleInputChange(event: ChangeEvent<HTMLSelectElement>) {
    const { name, value, options } = event.target;

    this.setState((prevState) => {
      let updatedFormData = { ...prevState.formData };

      if (name === "clienteId") {
        updatedFormData.clienteId = value === "" ? "" : parseInt(value);
      } else if (name === "produtos") {
        const selectedIds = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => parseInt(option.value));

        updatedFormData.produtos = selectedIds.map((id) => {
          const existingProduct = prevState.formData.produtos.find((p) => p.id === id);
          return existingProduct ? existingProduct : { id, quantidade: 1 };
        });
      } else if (name === "servicos") {
        const selectedIds = Array.from(options)
          .filter((option) => option.selected)
          .map((option) => parseInt(option.value));

        updatedFormData.servicos = selectedIds.map((id) => {
          const existingService = prevState.formData.servicos.find((s) => s.id === id);
          return existingService ? existingService : { id, quantidade: 1 };
        });
      }

      return { formData: updatedFormData, errorMessage: "", successMessage: "" };
    });
  }

  handleQuantidadeChange(
    type: "produto" | "servico",
    id: number,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const quantidade = parseInt(event.target.value);
    if (isNaN(quantidade) || quantidade <= 0) {
      this.setState({ errorMessage: "A quantidade deve ser um número positivo.", successMessage: "" });
      return;
    }

    this.setState((prevState) => {
      let updatedItems;
      if (type === "produto") {
        updatedItems = prevState.formData.produtos.map((item) =>
          item.id === id ? { ...item, quantidade: quantidade } : item
        );
        return { formData: { ...prevState.formData, produtos: updatedItems }, errorMessage: "", successMessage: "" };
      } else {
        updatedItems = prevState.formData.servicos.map((item) =>
          item.id === id ? { ...item, quantidade: quantidade } : item
        );
        return { formData: { ...prevState.formData, servicos: updatedItems }, errorMessage: "", successMessage: "" };
      }
    });
  }

  async registrarConsumo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { formData } = this.state;
    const { onConsumoRegistrado, fetchClientes } = this.props; 

    if (formData.clienteId === "") {
      this.setState({ errorMessage: "Por favor, selecione um cliente.", successMessage: "" });
      return;
    }

    if (formData.produtos.length === 0 && formData.servicos.length === 0) {
      this.setState({ errorMessage: "Por favor, selecione ao menos um produto ou serviço.", successMessage: "" });
      return;
    }

    try {
      for (const p of formData.produtos) {
        const res = await fetch(`http://localhost:3001/consumos/produtos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clienteId: formData.clienteId,
            produtoId: p.id,
            quantidade: p.quantidade,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.erro || `Erro HTTP ao registrar produto! status: ${res.status}`);
        }
      }

      for (const s of formData.servicos) {
        const res = await fetch(`http://localhost:3001/consumos/servicos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clienteId: formData.clienteId,
            servicoId: s.id,
            quantidade: s.quantidade,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.erro || `Erro HTTP ao registrar serviço! status: ${res.status}`);
        }
      }

      this.setState({
        successMessage: "Consumo(s) registrado(s) com sucesso!",
        errorMessage: "",
        formData: {
          clienteId: "",
          produtos: [],
          servicos: [],
        },
      });

      if (onConsumoRegistrado) {
        onConsumoRegistrado();
      }

      fetchClientes();

    } catch (err: any) {
      console.error("Erro ao registrar consumo:", err);
      this.setState({ errorMessage: `Erro ao registrar consumo: ${err.message || err}`, successMessage: "" });
    }
  }

  render() {
    const { tema, clientes, produtos, servicos } = this.props;
    const { formData, errorMessage, successMessage } = this.state;
    const produtosExibidos = produtos.filter(p => formData.produtos.some(fp => fp.id === p.id));
    const servicosExibidos = servicos.filter(s => formData.servicos.some(fs => fs.id === s.id));

    return (
      <div className="container card shadow p-4">
        <h4 className="mb-4">Registrar Consumo</h4>

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

        <form onSubmit={this.registrarConsumo}>
          <div className="mb-3">
            <label htmlFor="clienteSelect" className="form-label">Cliente</label>
            <select
              id="clienteSelect"
              className="form-select"
              name="clienteId"
              value={formData.clienteId}
              onChange={this.handleInputChange}
            >
              <option value="">Selecione...</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="produtosSelect" className="form-label">Produtos</label>
            <select
              id="produtosSelect"
              className="form-select"
              multiple
              name="produtos"
              value={formData.produtos.map(p => p.id.toString())}
              onChange={this.handleInputChange}
            >
              {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} (R$ {p.preco.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {formData.produtos.length > 0 && (
            <div className="mb-4 p-3 border rounded">
              <h6 className="mb-3">Quantidades dos Produtos Selecionados:</h6>
              {produtosExibidos.map((prod) => {
                const currentQuantity = formData.produtos.find(p => p.id === prod.id)?.quantidade || 1;
                return (
                  <div className="row mb-2 align-items-center" key={`qty-prod-${prod.id}`}>
                    <div className="col-8">
                      <label htmlFor={`prod-qty-${prod.id}`} className="form-label mb-0">
                        {prod.nome}
                      </label>
                    </div>
                    <div className="col-4">
                      <input
                        type="number"
                        id={`prod-qty-${prod.id}`}
                        className="form-control form-control-sm"
                        value={currentQuantity}
                        onChange={(e) => this.handleQuantidadeChange("produto", prod.id, e)}
                        min="1"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="servicosSelect" className="form-label">Serviços</label>
            <select
              id="servicosSelect"
              className="form-select"
              multiple
              name="servicos"
              value={formData.servicos.map(s => s.id.toString())}
              onChange={this.handleInputChange}
            >
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} (R$ {s.preco.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {formData.servicos.length > 0 && (
            <div className="mb-4 p-3 border rounded">
              <h6 className="mb-3">Quantidades dos Serviços Selecionados:</h6>
              {servicosExibidos.map((serv) => {
                const currentQuantity = formData.servicos.find(s => s.id === serv.id)?.quantidade || 1;
                return (
                  <div className="row mb-2 align-items-center" key={`qty-serv-${serv.id}`}>
                    <div className="col-8">
                      <label htmlFor={`serv-qty-${serv.id}`} className="form-label mb-0">
                        {serv.nome}
                      </label>
                    </div>
                    <div className="col-4">
                      <input
                        type="number"
                        id={`serv-qty-${serv.id}`}
                        className="form-control form-control-sm"
                        value={currentQuantity}
                        onChange={(e) => this.handleQuantidadeChange("servico", serv.id, e)}
                        min="1"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button type="submit" className="btn btn-success" style={{ backgroundColor: tema }}>
            Registrar Consumo
          </button>
        </form>
      </div>
    );
  }
}