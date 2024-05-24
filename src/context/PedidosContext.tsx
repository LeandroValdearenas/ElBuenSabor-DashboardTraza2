import { Dispatch, ReactNode, createContext, useRef, useState } from "react";
import Pedido from "../entidades/Pedido";
import PedidoService from "../servicios/PedidoService";
import ModalGenerico from "../componentes/modalGenerico/ModalGenerico";
import Pedidos from "../screens/pedidos/Pedidos";

interface PedidosContextType {
    pedidos: Pedido[],
    modalPedidos: any,
    openModalPedidos: () => void,
    setPedidos: Dispatch<React.SetStateAction<Pedido[]>>,
    getPedidosRest: () => void
}

export const PedidosContext = createContext<PedidosContextType>({
    pedidos: [],
    modalPedidos: <></>,
    openModalPedidos: () => { },
    setPedidos: () => { },
    getPedidosRest: () => { }
});

export function PedidosContextProvider({ children }: { children: ReactNode }) {

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const modalRefPedidos = useRef<any>(null);

    const urlapi = import.meta.env.VITE_API_URL;
    const pedidoService = new PedidoService(urlapi + "/pedidos");

    const getPedidosRest = async () => {
        let pedidos: Pedido[] = await pedidoService.getAll();
        setPedidos(pedidos);
    }

    const openModalPedidos = () => {
        if (modalRefPedidos.current) {
            modalRefPedidos.current.openModal();
        }
    }

    const modalPedidos =
        <ModalGenerico titulo="pedidos" tituloModal="Pedidos" ref={modalRefPedidos}>
            <Pedidos />
        </ModalGenerico>

    return (
        <PedidosContext.Provider value={{
            pedidos,
            modalPedidos,
            openModalPedidos,
            setPedidos,
            getPedidosRest
        }}>
            {children}
            {modalPedidos}
        </PedidosContext.Provider>
    );
}