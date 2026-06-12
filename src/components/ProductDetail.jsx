import React from "react";
import { addToCart } from "../utils/cartStore";
import { getYouTubeThumbnail, isVideoFile } from "../utils/videoUtils";

export default function ProductDetail({ product, onClose }) {
  if (!product) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{padding:20}}>
        <div style={{display:'flex',gap:18}}>
          <div style={{flex:'0 0 48%',borderRadius:12,overflow:'hidden'}}>
            {product.image ? (
              <img src={product.image} alt={product.title} style={{width:'100%',height:360,objectFit:'cover',borderRadius:12}} />
            ) : getYouTubeThumbnail(product.videoUrl) ? (
              <div style={{position:'relative'}}>
                <img src={getYouTubeThumbnail(product.videoUrl)} alt={product.title} style={{width:'100%',height:360,objectFit:'cover',borderRadius:12}} />
                <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',fontSize:28,color:'white'}}>▶</div>
              </div>
            ) : isVideoFile(product.videoUrl) ? (
              <video controls src={product.videoUrl} style={{width:'100%',height:360,objectFit:'cover',borderRadius:12}} />
            ) : (
              <div style={{height:360,background:'#0B1220',borderRadius:12}} />
            )}
          </div>
          <div style={{flex:1}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div>
                <div style={{fontWeight:800,fontSize:20}}>{product.title}</div>
                <div style={{color:'#94A3B8',marginTop:6}}>{product.subtitle}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:800,color:'#2563FF',fontSize:20}}>{product.price}</div>
                <div style={{color:'#34d399',marginTop:6}}>● In Stock</div>
              </div>
            </div>

            <div className="specs" style={{marginTop:14}}>
              <div className="spec">6.7" Super Retina</div>
              <div className="spec">A17 Pro Chip</div>
              <div className="spec">256GB</div>
              <div className="spec">48MP Triple Camera</div>
            </div>

            <div style={{display:'flex',gap:12,marginTop:18}}>
              <button className="btn-primary" style={{flex:1}} onClick={() => { addToCart({ id: product.id, title: product.title, price: product.price, sellerId: product.sellerId }); alert('Added to cart'); }}>Add to Cart</button>
              <button className="btn-primary" style={{flex:1,background:'#2563FF',color:'#FFFFFF'}} onClick={() => { addToCart({ id: product.id, title: product.title, price: product.price, sellerId: product.sellerId }); window.location.reload(); }}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
