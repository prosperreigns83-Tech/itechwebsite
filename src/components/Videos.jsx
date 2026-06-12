import React, { useEffect, useState } from "react";
import { getProducts } from "../utils/productStore";
import BottomNav from "./BottomNav";
import { getYouTubeThumbnail, isVideoFile } from "../utils/videoUtils";

function extractYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) {
      return 'https://www.youtube.com/embed/' + u.searchParams.get('v');
    }
    if (u.hostname === 'youtu.be') {
      return 'https://www.youtube.com/embed/' + u.pathname.slice(1);
    }
  } catch (e) {}
  return null;
}

export default function Videos({ activePage, onNavigate }){
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(()=>{
    const load = () => setProducts(getProducts());
    load();
    const handler = () => load();
    window.addEventListener('products-updated', handler);
    return () => window.removeEventListener('products-updated', handler);
  },[]);

  const allVideos = products.filter(p => p.videoUrl && p.videoUrl.trim().length > 0);
  const categories = ['All', 'Phones', 'Laptops', 'Accessories'];

  let videos = filter === 'All' ? allVideos : allVideos.filter(v => v.category === filter);
  if (search && search.trim()) {
    const q = search.toLowerCase();
    videos = videos.filter(v => (v.title || '').toLowerCase().includes(q) || (v.subtitle || '').toLowerCase().includes(q));
  }

  function parseViews(str) {
    if (!str) return 0;
    const m = String(str).toUpperCase().replace(/,/g,'').match(/(\d+(?:\.\d+)?)([KM]?)/);
    if (!m) return 0;
    let val = parseFloat(m[1]);
    const unit = m[2];
    if (unit === 'K') val *= 1e3;
    if (unit === 'M') val *= 1e6;
    return val;
  }

  function parseDuration(d) {
    if (!d) return 0;
    const parts = String(d).split(':').map(x=>parseInt(x||0,10));
    if (parts.length === 2) return parts[0]*60 + parts[1];
    if (parts.length === 3) return parts[0]*3600 + parts[1]*60 + parts[2];
    return 0;
  }

  if (sortBy === 'views') {
    videos = videos.slice().sort((a,b) => parseViews(b.views) - parseViews(a.views));
  } else if (sortBy === 'duration') {
    videos = videos.slice().sort((a,b) => parseDuration(b.duration) - parseDuration(a.duration));
  } else {
    // newest by id (assumes id increases)
    videos = videos.slice().sort((a,b) => (b.id||0) - (a.id||0));
  }

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
          <div style={{fontWeight:800,fontSize:18,color:'#FFFFFF'}}>Product Videos</div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input placeholder="Search videos" className="search" value={search} onChange={(e)=>setSearch(e.target.value)} style={{width:200}} />
            <select className="login-input" value={sortBy} onChange={(e)=>setSortBy(e.target.value)} style={{width:140}}>
              <option value="newest">Newest</option>
              <option value="views">Most views</option>
              <option value="duration">Duration</option>
            </select>
            <div style={{color:'#94A3B8',cursor:'pointer'}} onClick={()=>onNavigate('home')}>Close</div>
          </div>
        </div>

        <div className="video-filters" style={{marginTop:12}}>
          {categories.map(c => (
            <button key={c} className={`chip ${filter===c? 'active':''}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>

        <div style={{marginTop:12}}>
          {videos.length === 0 && (
            <div className="no-results">No videos found for this category.</div>
          )}

          <div className="video-list">
            {videos.map(p => (
              <div key={p.id} className="video-list-item" onClick={() => onNavigate('video', p.id)}>
                <div className="video-thumb">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="product-image" />
                    ) : getYouTubeThumbnail(p.videoUrl) ? (
                      <img src={getYouTubeThumbnail(p.videoUrl)} alt={p.title} className="product-image" />
                    ) : isVideoFile(p.videoUrl) ? (
                      <video src={p.videoUrl} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    ) : (
                      <div className="thumb" />
                    )}
                    <div className="play-overlay">▶</div>
                    <div className="duration-badge">{p.duration || '03:30'}</div>
                  </div>

                <div className="video-meta">
                  <div className="video-title">{p.title}</div>
                  <div className="channel-row">
                    <div style={{fontWeight:700,color:'#FFFFFF'}}>ITECH-STORE</div>
                    <div className="verified-badge">✔</div>
                    <div style={{marginLeft:8,color:'#94A3B8',fontSize:13}}>{p.views || '12K views'} • {p.uploaded || '2 weeks ago'}</div>
                  </div>
                  <div className="video-desc">{p.subtitle || 'Product video preview and overview.'}</div>
                </div>
                <div className="video-actions">⋮</div>
                <div className="video-sep" />
              </div>
            ))}
          </div>
        </div>

      </div>
      <BottomNav active={activePage} onNavigate={onNavigate} />
    </div>
  )
}
