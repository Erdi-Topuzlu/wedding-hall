import React from 'react'

export default function Contact() {
  return (
    <div className="container my-5">
      <h2>İletişim & Konum</h2>
      <div className="row mt-4">
        {/* Yetkili Kartı */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm p-4 text-center">
            <h4 className="card-title mb-2">Gürkan Mandalı</h4>
            <p className="text-muted mb-3">Düğün Salonu Yetkilisi</p>
            <div className="d-flex flex-column align-items-center gap-2">
              <div>
                <strong>Telefon : </strong>
                +90 555 555 55 55
              </div>
              <div>
                <strong>E-posta : </strong>
                gurkanmandali@gmail.com
              </div>
              <div>
                <strong>Adres : </strong>
                İnönü Mh. Yiğit Sk. No:2 Kapaklı/TEKİRDAĞ
              </div>
            </div>
          </div>
        </div>

        {/* Konum */}
        <div className="col-md-6">
          
          <div style={{ width: '100%', height: 300 }}>
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d749.0241758620232!2d27.97438876512983!3d41.32851049519143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b528f7793e2ac5%3A0xc0ea740ad4131cac!2zQWxpIMSwaHNhbiBNYW5kYWzEsSBEw7zEn8O8biBTYWxvbnU!5e0!3m2!1str!2sus!4v1762976099186!5m2!1str!2sus"
              style={{ width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
