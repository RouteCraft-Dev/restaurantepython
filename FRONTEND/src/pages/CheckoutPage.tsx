import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = ({ cart, removeFromCart, clearCart, fetchProducts }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [metodoEntrega, setMetodoEntrega] = useState<'LOCAL' | 'ENVIO'>('LOCAL');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();
  
  // DETECCIÓN DINÁMICA: Si estás en localhost usa el puerto 5000, si estás en Vercel usa la ruta vacía (relativa)
  const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  const API_BASE_URL = isLocal ? "http://localhost:5000" : "";

  // Calcular subtotal de productos
  const subtotal = cart.reduce((acc: number, item: any) => {
    const basePrice = Number(item.price) || 0;
    const discount = Number(item.discount_percentage) || 0;
    const precioFinal = item.on_sale === true ? basePrice - (basePrice * discount / 100) : basePrice;
    return acc + (precioFinal * (item.quantity || 1));
  }, 0);

  // Calcular recargo de envío (15%) si corresponde
  const recargoEnvio = metodoEntrega === 'ENVIO' ? subtotal * 0.15 : 0;
  const totalFinal = subtotal + recargoEnvio;

  const procesarCompra = async (metodoPago: 'MP' | 'WA') => {
    if (metodoEntrega === 'ENVIO' && (!direccion || !telefono)) {
      alert("⚠️ Por favor, completa la dirección y el teléfono para el envío.");
      return;
    }

    setIsProcessing(true);

    try {
      if (metodoPago === 'WA') {
        // --- OPCIÓN WHATSAPP: NO DESCUENTA STOCK EN BASE DE DATOS ---
        const mensaje = `¡Hola! Realicé un pedido:\n${cart.map((i: any) => `- ${i.quantity || 1}x ${i.name}`).join('\n')}\nTotal: $${totalFinal.toLocaleString()}\nEntrega: ${metodoEntrega === 'ENVIO' ? `Envío a domicilio (${direccion})` : 'Retiro en local'}`;
        
        window.open(`https://wa.me/5493794123456?text=${encodeURIComponent(mensaje)}`, '_blank');
        
        // Limpiamos el carrito local y regresamos al inicio
        clearCart();
        navigate('/');
      } else {
        // --- OPCIÓN MERCADO PAGO: SÍ REGISTRA Y DESCUENTA STOCK EN BACKEND ---
        const response = await axios.post(`${API_BASE_URL}/api/checkout`, {
          items: cart.map((item: any) => ({
            id: item.id,
            quantity: item.quantity || 1
          })),
          metodo: metodoPago,
          entrega: metodoEntrega,
          detalles_entrega: {
            direccion: metodoEntrega === 'ENVIO' ? direccion : 'Retiro en local',
            telefono: telefono,
          },
          total: totalFinal
        });

        if (response.status === 200 || response.status === 201) {
          alert("✅ ¡PEDIDO CONFIRMADO! El Capitán ya está avivando el fuego.");
          
          clearCart(); 
          
          if (typeof fetchProducts === 'function') {
            await fetchProducts(); 
          }

          navigate('/');
        }
      }
    } catch (error: any) {
      console.error("Error en la compra:", error);
      alert(error.response?.data?.error || "Error en la cocina. Intente nuevamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', padding: '150px 20px', minHeight: '100vh', background: '#1A1A1A' }}>
        <h2 style={{ fontFamily: 'Playfair Display', color: '#FFCC80', fontSize: '2.5rem', letterSpacing: '2px', textTransform: 'uppercase' }}>TU CARRITO ESTÁ VACÍO</h2>
        <p style={{ color: '#E57373', marginTop: '10px', fontFamily: 'serif', fontSize: '1.2rem' }}>EL CAPITÁN ESTÁ ESPERANDO TUS ÓRDENES</p>
        <Link to="/" style={{ display: 'inline-block', marginTop: '30px', padding: '15px 40px', background: '#D84315', color: 'white', textDecoration: 'none', fontWeight: 'bold', borderRadius: '50px', fontFamily: 'Playfair Display', letterSpacing: '2px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}>VER LA CARTA</Link>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper" style={{ paddingTop: '140px', paddingBottom: '80px', minHeight: '100vh', background: '#1A1A1A' }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
        <div className="checkout-main-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', maxWidth: '1200px', width: '100%', backgroundColor: '#8D0606', borderRadius: '20px', border: '4px solid #A01A1A', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
          
          {/* COLUMNA IZQUIERDA: RESUMEN */}
          <div style={{ padding: '40px', background: '#FFF8E1' }}>
            <h2 style={{ fontFamily: 'Playfair Display', color: '#3E2723', marginBottom: '30px', borderBottom: '2px solid #D84315', paddingBottom: '10px', fontSize: '1.8rem', textTransform: 'uppercase' }}>MI PEDIDO</h2>
            
            <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((item: any) => {
                const basePrice = Number(item.price) || 0;
                const discount = Number(item.discount_percentage) || 0;
                const precioUnitario = item.on_sale === true ? basePrice - (basePrice * discount / 100) : basePrice;
                
                const imageSrc = item.image || 'https://via.placeholder.com/150';

                return (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingBottom: '15px', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #D84315' }}>
                      <img src={imageSrc} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1rem', fontFamily: 'Playfair Display', color: '#1A1A1A', margin: 0 }}>{item.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: '#D84315', fontWeight: '900', margin: '5px 0' }}>{item.quantity || 1} x ${precioUnitario.toLocaleString()}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ background: '#E57373', border: 'none', color: 'white', borderRadius: '5px', padding: '5px 10px', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold' }}>X</button>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#3E2723', borderRadius: '15px', color: '#FFCC80' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                 <span>Subtotal:</span>
                 <span>${subtotal.toLocaleString()}</span>
               </div>
               {metodoEntrega === 'ENVIO' && (
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', color: '#E57373' }}>
                   <span>Recargo Envío (15%):</span>
                   <span>${recargoEnvio.toLocaleString()}</span>
                 </div>
               )}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,204,128,0.3)', paddingTop: '10px' }}>
                 <span style={{ fontFamily: 'Playfair Display', fontWeight: 'bold', fontSize: '1.2rem' }}>TOTAL:</span>
                 <span style={{ fontSize: '2rem', fontFamily: 'Playfair Display', fontWeight: '900' }}>${totalFinal.toLocaleString()}</span>
               </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: PAGO Y ENTREGA */}
          <div style={{ padding: '40px', color: 'white', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '1.8rem', letterSpacing: '2px', borderBottom: '1px solid rgba(255,204,128,0.3)', paddingBottom: '10px', color: '#FFCC80' }}>ENTREGA Y PAGO</h2>
            
            {/* SELECTOR DE ENTREGA */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '0.8rem', color: '#FFCC80', fontWeight: 'bold' }}>MODO DE ENTREGA</label>
              <select 
                value={metodoEntrega} 
                onChange={(e: any) => setMetodoEntrega(e.target.value)}
                style={{ padding: '12px', borderRadius: '8px', border: 'none', background: '#FFF8E1', color: '#3E2723', fontWeight: 'bold' }}
              >
                <option value="LOCAL">🏃 RETIRO EN LOCAL (GRATIS)</option>
                <option value="ENVIO">🛵 ENVÍO A DOMICILIO (+15%)</option>
              </select>
            </div>

            {/* CAMPOS DE ENVÍO DINÁMICOS */}
            {metodoEntrega === 'ENVIO' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                <input 
                  placeholder="DIRECCIÓN DE ENTREGA (Calle, N°, Depto)" 
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #FFCC80', background: 'transparent', color: 'white' }}
                />
                <input 
                  placeholder="TELÉFONO DE CONTACTO" 
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #FFCC80', background: 'transparent', color: 'white' }}
                />
              </div>
            )}

            {isProcessing ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', color: '#FFCC80' }}>AVIVANDO EL FUEGO...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                <p style={{ color: '#FFCC80', fontSize: '0.8rem', textAlign: 'center' }}>SELECCIONÁ MÉTODO DE PAGO</p>
                <button onClick={() => procesarCompra('MP')} style={{ background: '#FFF8E1', border: 'none', padding: '18px', borderRadius: '15px', cursor: 'pointer', fontWeight: '900', color: '#009EE3' }}>
                  MERCADO PAGO (ONLINE)
                </button>
                <button onClick={() => procesarCompra('WA')} style={{ background: '#25D366', border: 'none', padding: '18px', borderRadius: '15px', cursor: 'pointer', fontWeight: '900', color: 'white' }}>
                  PEDIR POR WHATSAPP
                </button>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#FFCC80', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }}>
                  CONTINUAR COMPRANDO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;