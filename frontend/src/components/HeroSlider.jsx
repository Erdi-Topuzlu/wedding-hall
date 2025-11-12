import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const HeroSlider = () => {
  return (
    <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img src="/src/assets/1.jpg" className="d-block w-100" alt="Salon 1" />
          <div className="carousel-caption d-none d-md-block">
            <h1 className="fw-bold">Rüya Gibi Düğünler</h1>
            <p>Hayalinizdeki anları bizimle yaşayın.</p>
            <a href="#reservation" className="btn btn-light">Rezervasyon Yap</a>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/src/assets/2.jpg" className="d-block w-100" alt="Salon 2" />
          <div className="carousel-caption d-none d-md-block">
            <h1 className="fw-bold">Şık ve Modern Salon</h1>
            <p>Her detayı özenle tasarlanmış bir ortam.</p>
            <a href="#gallery" className="btn btn-light">Galeriye Göz At</a>
          </div>
        </div>

        <div className="carousel-item">
          <img src="/src/assets/3.jpg" className="d-block w-100" alt="Salon 3" />
          <div className="carousel-caption d-none d-md-block">
            <h1 className="fw-bold">Mutluluğa İlk Adım</h1>
            <p>Unutulmaz bir başlangıç için doğru yerdesiniz.</p>
            <a href="#contact" className="btn btn-light">Bize Ulaşın</a>
          </div>
        </div>

         <div className="carousel-item">
          <img src="/src/assets/4.jpg" className="d-block w-100" alt="Salon 3" />
          <div className="carousel-caption d-none d-md-block">
            <h1 className="fw-bold">Mutluluğa İlk Adım</h1>
            <p>Unutulmaz bir başlangıç için doğru yerdesiniz.</p>
            <a href="#contact" className="btn btn-light">Bize Ulaşın</a>
          </div>
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
};

export default HeroSlider;
