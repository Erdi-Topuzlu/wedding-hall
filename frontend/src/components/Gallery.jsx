import React from 'react'

export default function Gallery(){
  const items = Array.from({length:9}).map((_,i)=>`https://picsum.photos/600/400?random=${i+10}`)
  return (
    <div className="container my-5">
      <h2 className="mb-4">Galeri</h2>
      <div className="row g-3">
        {items.map((src, idx)=>(
          <div key={idx} className="col-12 col-sm-6 col-md-4">
            <div className="card">
              <img src={src} className="card-img-top" alt={`galeri-${idx}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
