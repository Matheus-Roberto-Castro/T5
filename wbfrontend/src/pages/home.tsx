import { Component } from "react";
import { Funcao } from "../types/funcao";
import CardFuncao from "../componentes/card";

const funcoes: Funcao[] = [
    {
        titulo: "Registrar Consumo",
        descricao: "Registre produtos e serviços consumidos por um cliente.",
        icone: "bi bi-cart-fill",
        link: "Registrar consumo",
    },
    {
        titulo: "Cadastrar Cliente",
        descricao: "Adicione um novo pet para um cliente.",
        icone: " fas fa-user",
        link: "Cadastro",
    },
    {
        titulo: "Ver Estatísticas",
        descricao: "Veja os produtos e serviços mais consumidos.",
        icone: "bi bi-bar-chart-fill",
        link: "Estatisticas",
    },
];

type props = {
  seletorView: (novaTela: string, evento: any) => void;
};

export default class Home extends Component<props> {
    render() {
        return (
            <div className="container-fluid align-items-center justify-content-center d-flex flex-wrap" style={{ minHeight: '80vh' }}>
                {funcoes.map((f) => (
                    <CardFuncao funcao={f} seletorView={this.props.seletorView} />
                ))}
            </div>
        )
    }
}