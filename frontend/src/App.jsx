import React from 'react'
import HeroSlider from './components/HeroSlider'
import Reservation from './components/Reservation'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import AdminPanel from './components/AdminPanel'
import { Routes, Route, Link } from 'react-router-dom'
import { useState } from "react";
import AdminLogin from './components/AdminLogin'

export default function App(){

  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">Düğün Salonu</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
            <span className="navbar-toggler-icon"/>
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Ana Sayfa</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/reservations">Rezervasyon</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/gallery">Galeri</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">İletişim</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<><HeroSlider/><section className="container my-5">
          <hr className="my-5" style={{
  border: "none",
  height: "3px",
  background: "linear-gradient(to right, transparent, #ccc, transparent)"
}} />
          <h2>Hızlı Rezervasyon</h2><Reservation compact/></section>
          <hr className="my-5" style={{
  border: "none",
  height: "3px",
  background: "linear-gradient(to right, transparent, #ccc, transparent)"
}} />
          <section><Gallery /></section>
          <hr className="my-5" style={{
  border: "none",
  height: "3px",
  background: "linear-gradient(to right, transparent, #ccc, transparent)"
}} />
<section><Contact /></section>
          </>} />
        <Route path="/reservations" element={<Reservation/>} />
        <Route path="/gallery" element={<Gallery/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/admin" element={
          adminLoggedIn ? 
            <AdminPanel /> :
            <AdminLogin onLogin={setAdminLoggedIn} />
        }/>
      </Routes>

      <footer className="bg-light py-4 mt-5">
        <div className="container text-center">© {new Date().getFullYear()} Düğün Salonu</div>
      </footer>
    </div>
  )
}
