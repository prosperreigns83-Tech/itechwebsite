import React, { useState } from "react";
import { addProduct } from "../utils/productStore";
import { getYouTubeThumbnail, getYouTubeEmbed, isVideoFile } from "../utils/videoUtils";
import BottomNav from "./BottomNav";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadProduct({ onNavigate, storedAccount }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Phones");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoFileName, setVideoFileName] = useState("");
  const [duration, setDuration] = useState("");
  const [views, setViews] = useState("");
  const [uploaded, setUploaded] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await fileToDataUrl(file);
      setPreview(data);
      setImageUrl(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleVideoFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await fileToDataUrl(file);
      setVideoUrl(data);
      setVideoFileName(file.name);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = data;
      video.onloadedmetadata = () => {
        const seconds = Math.round(video.duration || 0);
        const mins = Math.floor(seconds / 60);
        const secs = String(seconds % 60).padStart(2, '0');
        setDuration(`${mins}:${secs}`);
      };
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category) {
      setError("Please provide at least a title and category.");
      return;
    }
    const id = Date.now();
    const savedImage = imageUrl || preview || getYouTubeThumbnail(videoUrl) || "";
    const product = {
      id,
      category,
      title,
      price: price || "",
      stock: stock || 0,
      subtitle: subtitle || "",
      image: savedImage,
      videoUrl: videoUrl || ""
    };
    if (storedAccount && storedAccount.id) {
      product.sellerId = storedAccount.id;
      product.sellerName = storedAccount.name || storedAccount.username || "";
      product.status = "pending";
    }
    if (duration) product.duration = duration;
    if (views) product.views = views;
    if (uploaded) product.uploaded = uploaded;
    addProduct(product);
    if (storedAccount && storedAccount.role === 'seller') {
      onNavigate('seller-dashboard');
    } else {
      onNavigate('home');
    }
  };

  return (
    <div className="app-shell">
      <div className="home" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#FFFFFF" }}>Upload Product</div>
          <div style={{ color: "#94A3B8", cursor: "pointer" }} onClick={() => onNavigate("home")}>Close</div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">Title</label>
          <input className="login-input" value={title} onChange={(e)=>setTitle(e.target.value)} />

          <label className="login-label">Category</label>
          <select className="login-input" value={category} onChange={(e)=>setCategory(e.target.value)}>
            <option>Phones</option>
            <option>Laptops</option>
            <option>Accessories</option>
            <option>Audio</option>
            <option>Gaming</option>
            <option>Wearables</option>
          </select>

          <label className="login-label">Price</label>
          <input className="login-input" value={price} onChange={(e)=>setPrice(e.target.value)} />

          <label className="login-label">Stock quantity</label>
          <input className="login-input" value={stock} onChange={(e)=>setStock(e.target.value)} placeholder="e.g., 10" />

          <label className="login-label">Subtitle / Short details</label>
          <input className="login-input" value={subtitle} onChange={(e)=>setSubtitle(e.target.value)} />

          <label className="login-label">Image URL</label>
          <input className="login-input" value={imageUrl} onChange={(e)=>{setImageUrl(e.target.value); setPreview(e.target.value);}} />

          <label className="login-label">Or upload image</label>
          <input className="login-input" type="file" accept="image/*" onChange={handleFile} />

          {preview && <img alt="preview" src={preview} style={{width:120,height:120,objectFit:'cover',borderRadius:12,marginTop:10}} />}

          <label className="login-label">Video URL (optional)</label>
          <input className="login-input" value={videoUrl} onChange={(e)=>setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or .mp4" />
          {videoUrl && getYouTubeThumbnail(videoUrl) && (
            <div style={{marginTop:10}}>
              <div style={{fontSize:13,color:'#94A3B8',marginBottom:6}}>YouTube thumbnail preview</div>
              <img src={getYouTubeThumbnail(videoUrl)} alt="video preview" style={{width:180,height:100,objectFit:'cover',borderRadius:14}} />
            </div>
          )}

          <label className="login-label">Or upload video</label>
          <input className="login-input" type="file" accept="video/*" onChange={handleVideoFile} />
          {videoFileName && <div style={{marginTop:8,color:'#94A3B8',fontSize:13}}>Selected: {videoFileName}</div>}

          <label className="login-label">Duration (mm:ss, optional)</label>
          <input className="login-input" value={duration} onChange={(e)=>setDuration(e.target.value)} placeholder="03:30" />

          <label className="login-label">Views (optional)</label>
          <input className="login-input" value={views} onChange={(e)=>setViews(e.target.value)} placeholder="12K views" />

          <label className="login-label">Uploaded (optional)</label>
          <input className="login-input" value={uploaded} onChange={(e)=>setUploaded(e.target.value)} placeholder="2 weeks ago" />

          {error && <div className="login-error">{error}</div>}

          <button className="btn-primary" style={{marginTop:12}} type="submit">Save Product</button>
        </form>
      </div>
        <BottomNav active={null} onNavigate={onNavigate} />
    </div>
  );
}
