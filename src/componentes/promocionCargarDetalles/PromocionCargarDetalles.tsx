
import { useEffect, useState }from "react";
import ArticuloManufacturado from '../../entidades/ArticuloManufacturado';
import PromocionDetalle from '../../entidades/PromocionDetalle';
import ArticuloManufacturadoService from "../../servicios/ArticuloManufacturadoService";
import ArticuloInsumoService from "../../servicios/ArticuloInsumoService";
import ArticuloInsumo from "../../entidades/ArticuloInsumo";

type DetallesPromocionesArgs = {
    detallesPrevios: PromocionDetalle[],
    handleChange: (key: keyof object, value: any) => void
}

function PromocionCargarDetalles({ detallesPrevios, handleChange }: DetallesPromocionesArgs) {
    const [detalles, setDetalles] = useState<PromocionDetalle []>([]);
    const [articulos, setArticulos] = useState<(ArticuloManufacturado | ArticuloInsumo)[]>([]);
    const [selectedArticulo, setSelectedArticulo] = useState("0");
    const [cantidad, setCantidad] = useState(0);
    const [unidadMedida, setUnidadMedida] = useState("");

    const urlapi = import.meta.env.VITE_API_URL;
    const insumoService = new ArticuloInsumoService(urlapi + "/insumos");
    const manufacturadoService = new ArticuloManufacturadoService(urlapi + "/manufacturados");

    const getArticulosRest = async () => {
        const datosInsumos:ArticuloInsumo[] = (await insumoService.getAll()).filter(a => !a.esParaElaborar);
        const datosManufacturados:ArticuloManufacturado[] = await manufacturadoService.getAll();
        setArticulos([...datosInsumos, ...datosManufacturados]);
    }

    const agregarArticulo = () => {
        if (selectedArticulo === "0") {
            return;
        }
        if (cantidad === 0) {
            return;
        }

        const articulo:ArticuloInsumo|ArticuloManufacturado = articulos.filter((articulo) => {return articulo.id === Number(selectedArticulo)})[0];

        const detalle:PromocionDetalle = new PromocionDetalle;
        articulo.type = articulo instanceof ArticuloInsumo ? 'insumo' : 'manufacturado';
        detalle.articulo = articulo;
        detalle.cantidad = cantidad;
        setDetalles( [...detalles.filter(detalle => {return detalle.articulo.id !== articulo.id}), detalle] );

        setCantidad(0);
        setSelectedArticulo("0");
    }

    const deleteDetalle = (id:number) => {
        setDetalles([...detalles.filter((_detalle, index) => index !== id)]);
    }

    const handleChangeArticulo = (e:React.ChangeEvent<HTMLSelectElement>) => {
        const idArticulo = e.target.value;
        let unidad = "";
        if (idArticulo !== "0") {
            unidad = articulos.filter((articulo) => {return articulo.id === Number(e.target.value)})[0].unidadMedida.denominacion;
        }
        setUnidadMedida(unidad);
        setSelectedArticulo(e.target.value);
    }

    useEffect(() => {
        getArticulosRest();
    }, []);

    useEffect(() => {
        setDetalles(detallesPrevios);
    }, [detallesPrevios]);

    useEffect(() => {
        handleChange('promocionDetalles' as keyof object, detalles);
    }, [detalles]);

    return (
    <div className="p-3 border rounded">
        
        <div style={{height:'248px', overflowY:'auto'}}>
        <table className='table'>
            <thead>
                <tr>
                    <th style={{width:"50%", textAlign:'left', marginLeft: '10%'}}>
                        <label htmlFor="cboDetalleArticuloManufacturado" className="form-label">ArticuloManufacturado</label>
                        <select id="cboDetalleArticuloManufacturado" className='form-select' value={selectedArticulo} onChange={e => handleChangeArticulo(e)}>
                                
                            <option value={0}>Seleccionar artículo</option>

                            {articulos?.map((articulo:ArticuloManufacturado|ArticuloInsumo) => 
                                <option key={articulo.id} value={articulo.id}>{articulo.denominacion}</option>
                            )}

                        </select>
                    </th>

                    <th style={{width:"10%", textAlign:'left'}}>
                        <label htmlFor="txtCantidad" className="form-label">Cantidad</label>
                        <input type="text" id="txtCantidad" className="form-control" pattern="[0-9]+" placeholder="Ingrese la cantidad del artículo" value={cantidad ? cantidad : ''} onChange={e => setCantidad(Number(e.target.value))} />
                    </th>

                    <th style={{width:"20%", textAlign:'center'}}>
                        <label htmlFor="txtUnidadMedida" className="form-label">Medida</label>
                        <input type="text" id="txtUnidadMedida" className="form-control" value={unidadMedida} disabled />
                    </th>

                    <th style={{width:"25%", textAlign:'center'}}>
                        <label htmlFor="btnAgregar" className="form-label">Acciones</label>
                        <a className="btn btn-success mb-0 form-control" id="btnAgregar"  style={{ marginBottom:10 }} onClick={agregarArticulo}>Agregar</a>
                    </th>
                </tr>
            </thead>
            <tbody>
            {detalles.map((detalle, index) => (
                <tr key={index}>
                    <td style={{width:"60%"}}>{detalle.articulo.denominacion}</td>
                    <td style={{width:"5%", textAlign:'center'}}>{detalle.cantidad}</td>
                    <td style={{width:"10%", textAlign:'center'}}>{detalle.articulo.unidadMedida.denominacion}</td>
                    <td style={{width:"25%", textAlign:'center'}}><a className="btn btn-danger mb-0" style={{ marginBottom:10 }} onClick={() => deleteDetalle(index)}>Eliminar</a></td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
    );
}

export default PromocionCargarDetalles;