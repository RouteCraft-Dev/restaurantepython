import { Link, useNavigate } from 'react-router-dom';

const SearchPage = ({ products, searchTerm, addToCart, cart, isMaintenance }: any) => {  
  const navigate = useNavigate();
  
  // 1. Filtrado de resultados + Orden inverso (Nuevos primero)
  const results = products
    ? [...products]
        .reverse()
        .filter((p: any) => 
          (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.nombre && p.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.categoria && p.categoria.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    : [];

  return (
    <main className="explore-layout" style={{ backgroundColor: '#1A1A1A', minHeight: '100vh', paddingTop: '140px', paddingBottom: '80px' }}>
      <div className="content-wrapper" style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
        
        {/* ENCABEZADO DE BÚSQUEDA */}
        <header className="search-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ 
                background: 'transparent', 
                border: 'none', 
                fontFamily: 'Inter, sans-serif', 
                fontSize: '12px', 
                letterSpacing: '2px', 
                cursor: 'pointer',
                marginBottom: '20px',
                textDecoration: 'underline',
                color: '#FFCC80'
            }}
          >
            VOLVER AL INICIO
          </button>
          
          <h2 style={{ 
            fontFamily: 'Playfair Display, serif', 
            fontSize: '2.5rem', 
            textTransform: 'uppercase', 
            color: '#F4F1ED',
            letterSpacing: '2px',
            margin: 0
          }}>
            RESULTADOS PARA: <span style={{ color: '#8B0000' }}>"{searchTerm.toUpperCase()}"</span>
          </h2>
          
          <p style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontSize: '14px', 
            color: '#FFCC80', 
            marginTop: '10px',
            letterSpacing: '1px'
          }}>
            {results.length} ARTÍCULOS ENCONTRADOS
          </p>
        </header>

        {/* GRILLA IDÉNTICA A LA LANDING */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '30px' 
        }}>
          {results.length > 0 ? (
            results.map((p: any) => {
              // BLINDAJE ULTRA SEGURO CONTRA UNDEFINED Y NAN (Idéntico a tu Landing)
              const basePrice = Number(p.price) || Number(p.precio) || 0;
              const discount = Number(p.discount_percentage) || Number(p.porcentaje_descuento) || 0;
              const finalPrice = p.on_sale === true ? basePrice - (basePrice * discount / 100) : basePrice;

              // CORRECCIÓN PARA QUE LAS IMÁGENES SE VEAN CORRECTAS
              const imagenURL = p.image && p.image.startsWith('http') 
                ? p.image 
                : (p.imagen && p.imagen.startsWith('http') ? p.imagen : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600");

              return (
                <div key={p.id} style={{ 
                  backgroundColor: '#FFF8E1', 
                  borderRadius: '15px', 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between' /* <--- Cambiado de 'justify' a 'justifyContent' */
                }}>
                  {/* LINK CORRECTO AL DETALLE DEL PRODUCTO */}
                  <Link to={`/producto/${p.id}`} style={{ display: 'block', height: '220px', overflow: 'hidden' }}>
                    <img 
                      src={imagenURL} 
                      alt={p.name || p.nombre} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>

                  {/* CUERPO DE LA TARJETA CLARA */}
                  <div style={{ textAlign: 'center', padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ color: '#D84315', fontSize: '10px', letterSpacing: '2px', fontWeight: '900', display: 'block', textTransform: 'uppercase' }}>
                        {p.category || p.categoria || 'MENÚ'}
                      </span>
                      
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', margin: '8px 0', color: '#3E2723', textTransform: 'uppercase' }}>
                        {p.name || p.nombre}
                      </h3>
                      
                      {/* CONTENEDOR DE PRECIOS */}
                      <div style={{ marginBottom: '15px' }}>
                        {p.on_sale === true ? (
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            <span style={{ textDecoration: 'line-through', color: '#777', fontSize: '1rem' }}>
                              ${basePrice.toLocaleString()}
                            </span>
                            <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.6rem' }}>
                              ${finalPrice.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.6rem' }}>
                            ${basePrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* BOTÓN RECONVERTIDO AL NARANJA REDONDEADO DE LA TIENDA */}
                    <button 
                      onClick={() => addToCart(p)}
                      disabled={Number(p.stock) <= 0 || isMaintenance === true} 
                      style={{
                        background: '#D84315', 
                        color: 'white', 
                        borderRadius: '30px', 
                        width: '100%', 
                        padding: '12px', 
                        border: 'none', 
                        fontWeight: 'bold', 
                        cursor: (Number(p.stock) <= 0 || isMaintenance === true) ? 'not-allowed' : 'pointer',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        opacity: (Number(p.stock) <= 0 || isMaintenance === true) ? 0.6 : 1
                      }}
                    >
                      {isMaintenance === true ? 'PAUSADO' : Number(p.stock) <= 0 ? 'AGOTADO' : '¡PEDIR AHORA!'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', marginTop: '50px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#FFCC80', fontSize: '2rem' }}>
                SIN RESULTADOS EN EL CATÁLOGO
              </h2>
              <button 
                onClick={() => navigate('/explorar')}
                style={{
                    marginTop: '20px',
                    padding: '12px 30px',
                    background: '#8B0000',
                    color: 'white',
                    border: 'none',
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                }}
              >
                VER TODA LA COLECCIÓN
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;