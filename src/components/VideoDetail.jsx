import React, { useEffect, useState } from "react";
import { getProducts } from "../utils/productStore";
import BottomNav from "./BottomNav";
import { getYouTubeEmbed, getYouTubeThumbnail, isVideoFile } from "../utils/videoUtils";
import { resolveAssetPath } from "../utils/assetPath";

export default function VideoDetail({ onNavigate, productId, activePage }){
  const [product, setProduct] = useState(null);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(()=>{
    const all = getProducts();
    const p = all.find(x => String(x.id) === String(productId));
    setProduct(p || null);
  },[productId]);

  if (!product) {
    return (
      <div className="app-shell">
        <div className="home" style={{padding:18}}>
          <div style={{fontWeight:700}}>Video not found</div>
          <div style={{marginTop:12}}><button onClick={() => onNavigate('videos')} className="btn-primary">Back to Videos</button></div>
        </div>
          <BottomNav active={activePage || 'videos'} onNavigate={onNavigate} />
      </div>
    );
  }

  const embed = product.videoUrl ? getYouTubeEmbed(product.videoUrl) : null;
  const embedWithAutoplay = embed ? embed + (embed.includes('?') ? '&' : '?') + 'autoplay=1&mute=1' : null;
  const thumbnail = product.videoUrl ? getYouTubeThumbnail(product.videoUrl) : null;

  return (
    <div className="app-shell">
      <div className="home" style={{padding:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:800,fontSize:18,color:'#FFFFFF'}}>{product.title}</div>
          <div style={{color:'#94A3B8',cursor:'pointer'}} onClick={()=>onNavigate('videos')}>Close</div>
        </div>

        <div style={{marginTop:12}}>
          {embed ? (
            <iframe title="video" width="100%" height="260" src={autoplay ? embedWithAutoplay : embed} frameBorder="0" allowFullScreen allow="autoplay; encrypted-media"></iframe>
          ) : product.videoUrl && isVideoFile(product.videoUrl) ? (
            <video controls width="100%" src={product.videoUrl} autoPlay={autoplay} muted={autoplay}></video>
          ) : (
            <div style={{height:260,background:'#0B1220',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:14,position:'relative',overflow:'hidden'}}>
              {thumbnail ? (
                <>
                  <img src={thumbnail} alt={product.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',fontSize:28,color:'white'}}>▶</div>
                </>
              ) : product.image ? (
                <img src={resolveAssetPath(product.image)} alt={product.title} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              ) : (
                <div style={{color:'#94A3B8'}}>No preview available</div>
              )}
            </div>
          )}
        </div>

        <div style={{marginTop:12}}>
          <div style={{fontWeight:700}}>{product.title}</div>
          <div style={{marginTop:8}}>
            <label style={{fontSize:13,color:'#94A3B8',marginRight:8}}>Autoplay</label>
            <input type="checkbox" checked={autoplay} onChange={(e)=>setAutoplay(e.target.checked)} />
          </div>
          <div style={{color:'#94A3B8',marginTop:6}}>{product.subtitle}</div>
          <div style={{fontWeight:800,color:'#2563FF',marginTop:8}}>{product.price}</div>
        </div>

      </div>
    </div>
  );
}
