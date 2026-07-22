import { useState, useEffect } from 'react';
import axios from 'axios';
import './restaurant-admin.css'; // <-- Importamos los estilos del restaurante

const AdminPanel = ({ products, isMaintenance, setIsMaintenance, fetchProducts }: any) => {
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const API_BASE_URL = isLocal ? "http://localhost:5000" : "";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [salesPage, setSalesPage] = useState(1);
  const salesPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [sales, setSales] = useState<any[]>([]);
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'AL_FUEGO', 
    secondary_category: '',
    on_sale: false,
    discount_percentage: 0,
    new_until_days: 7 
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  const categoriasDisponibles = [
    'AL_FUEGO', 
    'BURGUERS', 
    'PIZZAS', 
    'EMPANADAS', 
    'POSTRES', 
    'BEBIDAS'
  ];

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/sales`);
      setSales(res.data || []);
    } catch (e) {
      console.error("Error cargando ventas", e);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);
  
  const prepareEdit = (p: any) => {
    setIsEditing(true);
    setEditingId(p.id);
    setProductData({
      name: p.name,
      price: p.price,
      stock: p.stock || 0,
      description: p.description || '',
      category: p.category ? p.category.toUpperCase() : 'AL_FUEGO',
      secondary_category: p.secondary_category || '',
      on_sale: p.on_sale || false,
      discount_percentage: p.discount_percentage || 0,
      new_until_days: p.new_until_days || 7
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setProductData({ 
      name: '', price: '', stock: '', description: '', 
      category: 'AL_FUEGO', secondary_category: '', 
      on_sale: false, discount_percentage: 0, new_until_days: 7 
    });
    setMainImage(null);
    setGalleryImages(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('price', String(productData.price));
    formData.append('stock', String(productData.stock));
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('secondary_category', productData.secondary_category);
    formData.append('on_sale', String(productData.on_sale));
    formData.append('discount_percentage', String(productData.discount_percentage));
    formData.append('new_until_days', String(productData.new_until_days));

    if (mainImage) {
      formData.append('image', mainImage);
    }
    
    if (galleryImages) {
      for (let i = 0; i < galleryImages.length; i++) {
        formData.append('gallery', galleryImages[i]);
      }
    }

    try {
      if (isEditing && editingId) {
        await axios.put(`${API_BASE_URL}/api/platos/${editingId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/platos`, formData);
      }
      
      alert("¡OPERACIÓN EXITOSA!");
      handleCancelEdit();
      
      if (fetchProducts) {
        await fetchProducts();
      }
      await fetchSales();
      
    } catch (error: any) {
      console.error("DETALLE DEL ERROR:", error.response?.data);
      alert("Error al guardar. Revisa los datos ingresados.");
    }
  };

  const toggleMaintenance = async () => {
    const nuevoEstado = !isMaintenance;
    try {
      await axios.post(`${API_BASE_URL}/api/toggle-maintenance`, { 
        value: nuevoEstado 
      });
      setIsMaintenance(nuevoEstado); 
      alert(nuevoEstado ? "MODO VACACIONES ACTIVADO" : "COCINA ABIERTA");
    } catch (e) {
      console.error(e);
      alert("Error al conectar con el servidor de ajustes");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿QUITAR ESTE PLATO DE LA CARTA?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/platos/${id}`);
        
        if (fetchProducts) {
          await fetchProducts();
        }
        await fetchSales();
      } catch (error) {
        alert("ERROR AL ELIMINAR");
      }
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const sortedProducts = [...safeProducts].sort((a: any, b: any) => b.id - a.id);
  const filteredProducts = sortedProducts.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString() === searchTerm
  );
  
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentSales = sales.slice((salesPage - 1) * salesPerPage, salesPage * salesPerPage);
  const totalSalesPages = Math.ceil(sales.length / salesPerPage);

  return (
    <div className="resto-container">
      <div className="resto-wrapper">
        
        {/* BUSCADOR */}
        <div className="resto-header">
          <h2 className="resto-title">PANEL DEL CAPITÁN</h2>
          <input 
            type="text" 
            placeholder="BUSCAR EN LA CARTA..." 
            className="resto-input resto-search-input"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>

        {/* FORMULARIO DE PLATOS */}
        <form onSubmit={handleSubmit} className="resto-form">
          <h3 className="resto-form-title">
            {isEditing ? `📝 MODIFICANDO: ${productData.name}` : '🔥 AÑADIR NUEVO PLATO'}
          </h3>
          
          <div className="resto-field-group">
            <label className="resto-label">NOMBRE DEL PLATO</label>
            <input type="text" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} className="resto-input" required />
          </div>
          
          <div className="resto-field-group">
            <label className="resto-label">CATEGORÍA DE COCINA</label>
            <select value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} className="resto-input">
              {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div className="resto-field-group">
            <label className="resto-label">PRECIO AL PÚBLICO ($)</label>
            <input type="number" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} className="resto-input" required />
          </div>

          <div className="resto-field-group">
            <label className="resto-label">STOCK (PORCIONES)</label>
            <input type="number" value={productData.stock} onChange={e => setProductData({...productData, stock: e.target.value})} className="resto-input" required />
          </div>
          
          <div className="resto-field-group">
            <label className="resto-label">ETIQUETA (EJ: RECOMENDADO)</label>
            <input type="text" value={productData.secondary_category} onChange={e => setProductData({...productData, secondary_category: e.target.value.toUpperCase()})} className="resto-input" />
          </div>

          <div className="resto-field-group">
            <label className="resto-label">DÍAS COMO "NUEVO"</label>
            <select value={productData.new_until_days} onChange={e => setProductData({...productData, new_until_days: parseInt(e.target.value)})} className="resto-input">
              {[1, 3, 7, 15, 30].map(d => <option key={d} value={d}>{d} DÍAS</option>)}
            </select>
          </div>

          <div className="resto-offer-box resto-full-width">
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#FFCC80' }}>
              <input type="checkbox" checked={productData.on_sale} onChange={e => setProductData({...productData, on_sale: e.target.checked})} /> ¿ES UNA OFERTA?
            </label>
            {productData.on_sale && (
              <input type="number" placeholder="% DESC" value={productData.discount_percentage} onChange={e => setProductData({...productData, discount_percentage: parseInt(e.target.value)})} className="resto-input" style={{ width: '150px' }} />
            )}
          </div>

          <textarea placeholder="INGREDIENTES O DESCRIPCIÓN..." className="resto-input resto-full-width" style={{ minHeight: '80px' }} value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} />
          
          <div className="resto-field-group">
            <label className="resto-label">FOTO PRINCIPAL</label>
            <input type="file" onChange={e => setMainImage(e.target.files ? e.target.files[0] : null)} style={{ color: '#aaa', fontSize: '12px' }} />
          </div>

          <div className="resto-field-group">
            <label className="resto-label">GALERÍA</label>
            <input type="file" multiple onChange={e => setGalleryImages(e.target.files)} style={{ color: '#aaa', fontSize: '12px' }} />
          </div>
          
          <div className="resto-full-width resto-actions-group" style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button type="submit" className="resto-btn-submit">
              {isEditing ? 'GUARDAR CAMBIOS' : 'AÑADIR A LA CARTA'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} className="resto-btn-cancel">
                CANCELAR
              </button>
            )}
          </div>
        </form>

        {/* LISTADO DE PRODUCTOS */}
        <div className="resto-card-section">
          <h3 className="resto-section-title">GESTIÓN DE STOCK</h3>
          <table className="resto-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>FOTO</th>
                <th>PLATO</th>
                <th>CATEGORÍA</th>
                <th>STOCK</th>
                <th>PRECIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p: any) => (
                <tr key={p.id}>
                  <td className="resto-table-id">#{p.id}</td>
                  <td>
                    {p.image ? (
                      <img src={p.image.startsWith('http') ? p.image : `${API_BASE_URL}${p.image}`} className="resto-img-thumb" alt={p.name} />
                    ) : (
                      <div className="resto-no-img">SIN FOTO</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{p.name}</td>
                  <td style={{ fontSize: '12px', color: '#AAA' }}>{p.category}</td>
                  <td style={{ fontWeight: 'bold', color: p.stock === 0 ? '#FF5252' : '#4CAF50' }}>{p.stock}</td>
                  <td style={{ fontWeight: 'bold' }}>${Number(p.price).toLocaleString()}</td>
                  <td>
                    <button onClick={() => prepareEdit(p)} className="resto-btn-edit">EDITAR</button>
                    <button onClick={() => handleDelete(p.id)} className="resto-btn-delete">BORRAR</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="resto-pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="resto-btn-page">Anterior</button>
            <span style={{ fontWeight: 'bold', color: '#FFCC80' }}> {currentPage} / {totalProductPages || 1} </span>
            <button disabled={currentPage === totalProductPages} onClick={() => setCurrentPage(currentPage + 1)} className="resto-btn-page">Siguiente</button>
          </div>
        </div>

        {/* HISTORIAL DE VENTAS */}
        <div style={{ marginTop: '80px' }}>
          <h2 className="resto-title" style={{ borderBottom: '3px solid #8D0606', paddingBottom: '10px' }}>COMANDAS FINALIZADAS</h2>
          <div className="resto-card-section" style={{ marginTop: '20px' }}>
            <table className="resto-table">
              <thead>
                <tr style={{ borderBottom: '2px solid #8D0606' }}>
                  <th>FECHA/HORA</th>
                  <th>ID TRANSACCIÓN</th>
                  <th>DETALLE DEL PEDIDO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {currentSales.length > 0 ? currentSales.map((sale: any) => {
                  const fechaFormateada = sale.date || "Sin fecha";
                  const listaItems = sale.items || [];
                  const detallePedido = Array.isArray(listaItems)
                    ? listaItems.map((item: any) => {
                        const cantidad = item.quantity || 1;
                        const platoEncontrado = safeProducts.find((prod: any) => prod.id === item.id);
                        const nombrePlato = platoEncontrado ? platoEncontrado.name : `Plato #${item.id}`;
                        return `${cantidad}x ${nombrePlato}`;
                      }).join(', ')
                    : "Sin detalle";

                  return (
                    <tr key={sale.id}>
                      <td>{fechaFormateada}</td>
                      <td>#{sale.id}</td>
                      <td style={{ fontSize: '12px', textTransform: 'uppercase' }}>{detallePedido}</td>
                      <td style={{ fontWeight: 'bold', color: '#FFCC80' }}>${Number(sale.total).toLocaleString()}</td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay comandas registradas</td></tr>
                )}
              </tbody>
            </table>
            
            <div className="resto-pagination">
              <button disabled={salesPage === 1} onClick={() => setSalesPage(salesPage - 1)} className="resto-btn-page">Anterior</button>
              <span style={{ color: '#FFCC80' }}>Página {salesPage} de {totalSalesPages || 1}</span>
              <button disabled={salesPage === totalSalesPages} onClick={() => setSalesPage(salesPage + 1)} className="resto-btn-page">Siguiente</button>
            </div>
          </div>
        </div>

        {/* MANTENIMIENTO */}
        <div className={`resto-maintenance-box ${isMaintenance ? 'closed' : 'open'}`}>
          <div style={{ color: 'white' }}>
            <h4 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '1.5rem' }}>
              ESTADO DE LA COCINA: {isMaintenance ? '⚠️ CERRADO' : '✅ ABIERTO'}
            </h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
              {isMaintenance ? 'Los clientes no pueden realizar pedidos en este momento.' : 'La tienda está recibiendo pedidos con normalidad.'}
            </p>
          </div>
          <button 
            onClick={toggleMaintenance} 
            className="resto-btn-toggle"
            style={{ color: isMaintenance ? '#8D0606' : '#1b4d21' }}
          >
            {isMaintenance ? 'ABRIR PERSIANA' : 'CERRAR POR VACACIONES'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;