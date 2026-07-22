// src/components/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: any;
  addToCart: (product: any) => void;
  isMaintenance?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart, isMaintenance }) => {
  const p = product;
  const basePrice = Number(p.price) || Number(p.precio) || 0;
  const discount = Number(p.discount_percentage) || Number(p.porcentaje_descuento) || 0;
  const hasDiscount = p.on_sale && discount > 0;
  const finalPrice = hasDiscount ? basePrice - (basePrice * discount / 100) : basePrice;
  const sinStockReal = Number(p.stock) <= 0;

  const imagenURL = p.image && p.image.startsWith('http') 
    ? p.image 
    : (p.imagen && p.imagen.startsWith('http') ? p.imagen : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600");

  return (
    <div style={{ 
      backgroundColor: '#FFF8E1', 
      borderRadius: '15px', 
      overflow: 'hidden', 
      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '430px', // Garantiza misma altura en mobile y desktop
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* BADGE DE DESCUENTO (Absoluto para no empujar la imagen ni alterar el alto) */}
      {hasDiscount && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          backgroundColor: '#B71C1C',
          color: '#FFF8E1',
          padding: '4px 10px',
          borderRadius: '20px',
          fontWeight: '900',
          fontSize: '0.8rem',
          zIndex: 10,
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          border: '1px solid #FFCC80',
          letterSpacing: '1px'
        }}>
          {discount}% OFF
        </div>
      )}

      {/* CONTENIDO SUPERIOR */}
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        
        {/* CONTENEDOR IMAGEN */}
        <Link to={`/producto/${p.id}`} style={{ display: 'block', height: '180px', width: '100%', overflow: 'hidden' }}>
          <img 
            src={imagenURL} 
            alt={p.name || p.nombre} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Link>
        
        {/* DETALLES Y TEXTOS */}
        <div style={{ textAlign: 'center', padding: '12px 12px 0 12px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
          
          <div>
            <span style={{ color: '#D84315', fontSize: '10px', letterSpacing: '2px', fontWeight: '900', textTransform: 'uppercase' }}>
              {p.category || p.categoria}
            </span>

            {/* TÍTULO (Altura fija y centrada para evitar saltos de línea dispares) */}
            <h3 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: '1.1rem', 
              margin: '6px 0', 
              color: '#3E2723',
              minHeight: '2.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1.2'
            }}>
              {p.name || p.nombre}
            </h3>
          </div>
          
          {/* BLOQUE DE PRECIO RIGIDO (Mismo alto estricto con o sin descuento) */}
          <div style={{ 
            margin: '10px 0', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '8px', 
            height: '42px', // Alto fijo exacto siempre
            boxSizing: 'border-box'
          }}>
            {hasDiscount ? (
              <>
                <span style={{ textDecoration: 'line-through', color: '#757575', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  ${basePrice.toLocaleString()}
                </span>
                <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.35rem' }}>
                  ${finalPrice.toLocaleString()}
                </span>
              </>
            ) : (
              <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.35rem' }}>
                ${basePrice.toLocaleString()}
              </span>
            )}
          </div>

        </div>
      </div>

      {/* BOTÓN AL PIE */}
      <div style={{ padding: '0 12px 12px 12px' }}>
        <button 
          onClick={() => addToCart(p)}
          disabled={sinStockReal || isMaintenance} 
          style={{
            background: '#D84315', 
            color: 'white', 
            borderRadius: '30px', 
            width: '100%', 
            padding: '10px', 
            border: 'none', 
            fontWeight: 'bold', 
            fontSize: '0.9rem',
            cursor: sinStockReal || isMaintenance ? 'not-allowed' : 'pointer',
            opacity: sinStockReal || isMaintenance ? 0.6 : 1
          }}
        >
          {isMaintenance ? 'PAUSADO' : sinStockReal ? 'AGOTADO' : '¡PEDIR AHORA!'}
        </button>
      </div>

    </div>
  );
};