import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const ProductDetail = ({ products, addToCart, isMaintenance }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p: any) => p.id === Number(id));

  const [displayImage, setDisplayImage] = useState<string | null>(null);

  if (!product) {
    return (
      <div style={{ padding: '150px 20px', textAlign: 'center', backgroundColor: '#1A1A1A', minHeight: '100vh', color: '#FFCC80' }}>
        <h2 style={{ fontFamily: 'Playfair Display' }}>PRODUCTO NO ENCONTRADO</h2>
        <Link to="/" style={{ color: '#E57373', textDecoration: 'underline' }}>Volver al inicio</Link>
      </div>
    );
  }

  // Si la imagen ya viene con http://localhost:5000/uploads/... se usa directo, sino fallback
  const mainImg = product.image || 'https://via.placeholder.com/500';

  const basePrice = Number(product.price) || 0;
  const discount = Number(product.discount_percentage) || 0;
  const finalPrice = product.on_sale ? basePrice - (basePrice * (discount / 100)) : basePrice;

  const currentImg = displayImage || mainImg;

  // Normalizamos la galería: si viene como array lo usamos directo, si es string hacemos el split
  let galleryArray: string[] = [];
  if (product.gallery) {
    if (Array.isArray(product.gallery)) {
      galleryArray = product.gallery;
    } else if (typeof product.gallery === 'string') {
      galleryArray = product.gallery.split(',').filter((img: string) => img.trim() !== '');
    }
  }

  return (
    <div className="product-detail-wrapper" style={{ 
      backgroundColor: '#1A1A1A', 
      minHeight: '100vh', 
      padding: '120px 20px 60px' 
    }}>
      
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {/* CONTENEDOR ROJO (ESTILO EXPLORER/LANDING) */}
        <div style={{ 
          backgroundColor: '#8D0606', 
          maxWidth: '1200px',
          width: '100%',
          borderRadius: '20px', 
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '4px solid #A01A1A',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          
          {/* LADO IZQUIERDO: VISUALES */}
          <div className="visual-sector">
            <div style={{ 
              backgroundColor: '#FFF8E1',
              borderRadius: '15px', 
              overflow: 'hidden', 
              height: '500px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              border: '2px solid #FFCC80'
            }}>
              <img src={currentImg} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>
            
            {/* CAROUSEL DE MINIATURAS */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '20px', overflowX: 'auto', padding: '10px' }}>
              <img 
                src={mainImg} 
                style={{ 
                  width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer',
                  border: currentImg === mainImg ? '3px solid #FFCC80' : '2px solid transparent',
                  borderRadius: '10px',
                  backgroundColor: '#FFF8E1'
                }}
                onClick={() => setDisplayImage(mainImg)}
                alt="principal"
              />

              {galleryArray.map((imgUrl: string, index: number) => {
                if (!imgUrl) return null;
                return (
                  <img 
                    key={index}
                    src={imgUrl} 
                    style={{ 
                      width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer',
                      border: currentImg === imgUrl ? '3px solid #FFCC80' : '2px solid transparent',
                      borderRadius: '10px',
                      backgroundColor: '#FFF8E1'
                    }}
                    onClick={() => setDisplayImage(imgUrl)}
                    alt={`galeria-${index}`}
                  />
                );
              })}
            </div>
          </div>

          {/* LADO DERECHO: INFO */}
          <div className="info-sector" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ color: '#FFCC80', letterSpacing: '3px', fontWeight: 'bold', fontSize: '0.9rem' }}>
              {product.category?.toUpperCase()}
            </span>

            <h1 style={{ 
              fontSize: '3rem', 
              margin: '15px 0', 
              fontFamily: 'Playfair Display, serif', 
              color: '#F4F1ED',
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {product.name}
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px', marginBottom: '30px' }}>
              <span style={{ color: '#FFCC80', fontSize: '2.8rem', fontWeight: '900' }}>
                ${finalPrice.toLocaleString()}
              </span>
              {product.on_sale && (
                <span style={{ textDecoration: 'line-through', color: '#E57373', fontSize: '1.4rem' }}>
                  ${basePrice.toLocaleString()}
                </span>
              )}
            </div>

            <p style={{ 
              color: '#3E2723', 
              lineHeight: '1.8', 
              marginBottom: '30px', 
              backgroundColor: '#FFF8E1', 
              padding: '25px', 
              borderRadius: '15px',
              borderLeft: '8px solid #FFCC80',
              fontFamily: 'serif',
              fontSize: '1.1rem'
            }}>
              {product.description || "Receta secreta del Capitán. Preparado con los mejores ingredientes de la región."}
            </p>

            <div style={{ marginBottom: '30px', padding: '0 10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#FFCC80', fontWeight: 'bold' }}>DISPONIBILIDAD:</span>
                <span style={{ color: product.stock > 0 ? '#F4F1ED' : '#FFCC80', fontWeight: 'bold' }}>
                  {product.stock > 0 ? `${product.stock} PORCIONES DISPONIBLES` : 'AGOTADO POR HOY'}
                </span>
              </div>
            </div>

            {/* BOTÓN ESTILO CAPITÁN */}
            <button 
              disabled={product.stock <= 0 || isMaintenance}
              onClick={() => addToCart(product)}
              style={{ 
                width: '100%', 
                padding: '20px', 
                fontSize: '1.2rem', 
                cursor: (product.stock <= 0 || isMaintenance) ? 'not-allowed' : 'pointer', 
                background: '#D84315', 
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                fontFamily: 'Playfair Display, serif',
                fontWeight: 'bold',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s, background 0.2s'
              }}
              onMouseOver={(e) => {
                if (product.stock > 0 && !isMaintenance) {
                  e.currentTarget.style.backgroundColor = '#BF360C';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseOut={(e) => {
                if (product.stock > 0 && !isMaintenance) {
                  e.currentTarget.style.backgroundColor = '#D84315';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {isMaintenance ? 'COCINA CERRADA' : product.stock > 0 ? '¡PEDIR AHORA!' : 'AGOTADO'}
            </button>
            
            <button 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#FFCC80', 
                marginTop: '30px', 
                cursor: 'pointer', 
                textDecoration: 'none',
                fontFamily: 'Playfair Display',
                letterSpacing: '1px'
              }} 
              onClick={() => navigate(-1)}
            >
              ← VOLVER A LA CARTA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;