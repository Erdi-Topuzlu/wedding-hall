import React, { useState } from "react";

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basit parola kontrolü
    if (password === "12345") {   // Parolayı isteğe göre değiştir
      onLogin(true);
    } else {
      setError("Parola yanlış");
    }
  };

  return (
    <div className="container my-5">
      <h2>Admin Girişi</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Parola</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary">Giriş</button>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>
    </div>
  );
}
