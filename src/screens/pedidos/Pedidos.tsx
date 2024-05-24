import Pedido from "../../entidades/Pedido";
import GrillaGenerica from "../../componentes/grillaGenerica/GrillaGenerica";
import PedidoService from "../../servicios/PedidoService";

export default function Pedidos() {
    const pedido = new Pedido();
    const pedidoBase = new Pedido();

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/pedidos");
    
    return (
        
    <div className="m-3">
        <GrillaGenerica entidadPrevia={pedido} entidadBase={pedidoBase} apiServicio={pedidoService} sinNuevo sinEditar/>
    </div>

    )
}