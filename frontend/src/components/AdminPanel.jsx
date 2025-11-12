import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import { Modal, Button } from "react-bootstrap";

export default function AdminPanel() {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("adminLoggedIn") === "true"
  );
  const [reservations, setReservations] = useState([]);
  const [editingResv, setEditingResv] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newReservation, setNewReservation] = useState({
    name: "",
    phone: "",
    eventType: "Düğün",
    status: "pending",
    date: new Date().toISOString().split("T")[0]
  });

  // --- Filter State ---
const [filterStatus, setFilterStatus] = useState("all");
const [filterEvent, setFilterEvent] = useState("all");
const [filterDate, setFilterDate] = useState("");

// --- Filtered Reservations ---
const filteredReservations = reservations.filter((r) => {
  const statusMatch = filterStatus === "all" || r.status === filterStatus;
  const eventMatch = filterEvent === "all" || r.eventType === filterEvent;
  const dateMatch = !filterDate || r.date === filterDate;
  return statusMatch && eventMatch && dateMatch;
});

  // --- Login / Logout ---
  const handleLogin = () => {
    setLoggedIn(true);
    localStorage.setItem("adminLoggedIn", "true");
  };
  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.setItem("adminLoggedIn", "false");
  };

  // --- Fetch & WebSocket Live Update ---
  useEffect(() => {
    if (!loggedIn) return;

    const fetchReservations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reservations");
        const data = await res.json();
        setReservations(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReservations();

    const ws = new WebSocket("ws://localhost:5001");
    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.type === "update") setReservations(data.reservations);
    };
    return () => ws.close();
  }, [loggedIn]);

  // --- CRUD İşlemleri ---
  const updateReservation = async (resv, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/reservations/${resv.date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resv, status: newStatus }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReservation = async (resv) => {
    try {
      await fetch(`http://localhost:5000/api/reservations/${resv.date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resv, status: "deleted" }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const saveEditReservation = async () => {
    if (!editingResv) return;
    try {
      await fetch(`http://localhost:5000/api/reservations/${editingResv.date}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingResv),
      });
      setEditingResv(null);
      setModalVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const addReservation = async () => {
    try {
      await fetch(`http://localhost:5000/api/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReservation),
      });
      setAddModalVisible(false);
      setNewReservation({
        name: "",
        phone: "",
        eventType: "Düğün",
        status: "pending",
        date: new Date().toISOString().split("T")[0]
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!loggedIn) return <AdminLogin onLogin={handleLogin} />;

  return (
    <div className="container my-5">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h3>Admin Panel</h3>
    <button className="btn btn-danger" onClick={handleLogout}>
      Çıkış Yap
    </button>
  </div>

  {/* Filtreler */}
  <div className="row mb-3">
    <div className="col-md-3 mb-2">
      <select className="form-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
        <option value="all">Tüm Durumlar</option>
        <option value="pending">Ön Rezerve</option>
        <option value="confirmed">Kesin Rezerve</option>
        <option value="deleted">Silinmiş</option>
      </select>
    </div>
    <div className="col-md-3 mb-2">
      <select className="form-select" value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
        <option value="all">Tüm Etkinlikler</option>
        <option value="Düğün">Düğün</option>
        <option value="Nişan">Nişan</option>
        <option value="Sünnet">Sünnet</option>
        <option value="Kına Gecesi">Kına Gecesi</option>
        <option value="Organizasyon">Organizasyon</option>
      </select>
    </div>
    <div className="col-md-3 mb-2">
      <input type="date" className="form-control" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
    </div>
    <div className="col-md-3 mb-2">
      <button className="btn btn-secondary w-100" onClick={() => { setFilterStatus("all"); setFilterEvent("all"); setFilterDate(""); }}>Temizle</button>
    </div>
  </div>

  {/* Table */}
  <div className="table-responsive">
    <table className="table table-bordered text-center align-middle">
      <thead className="table-light">
        <tr>
          <th style={{width: '15%'}}>Gün</th>
          <th style={{width: '20%'}}>İsim</th>
          <th style={{width: '15%'}}>Telefon</th>
          <th style={{width: '15%'}}>Etkinlik</th>
          <th style={{width: '15%'}}>Durum</th>
          <th style={{width: '20%'}}>İşlemler</th>
        </tr>
      </thead>
      <tbody>
        {filteredReservations.map((r, idx) => (
          <tr key={idx}>
            <td>
  {new Date(r.date).toLocaleDateString("tr-TR")}
  <br />
  <small>{new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(new Date(r.date))}</small>
</td>
            <td>{r.name}</td>
            <td>{r.phone}</td>
            <td>{r.eventType}</td>
            <td>{r.status}</td>
            <td>
              {r.status !== "confirmed" && (
                <button className="btn btn-success btn-sm me-2" onClick={() => updateReservation(r, "confirmed")}>
                  Onayla
                </button>
              )}
              <button className="btn btn-warning btn-sm me-2" onClick={() => { setEditingResv(r); setModalVisible(true); }}>
                Düzenle
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => deleteReservation(r)}>Sil</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

      {/* Düzenleme Modalı */}
      <Modal show={modalVisible} onHide={() => setModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Düzenle: {editingResv && new Date(editingResv.date).toLocaleDateString("tr-TR")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingResv && (
            <>
              <input className="form-control my-2" value={editingResv.name} onChange={(e) => setEditingResv({ ...editingResv, name: e.target.value })} placeholder="İsim" />
              <input className="form-control my-2" value={editingResv.phone} onChange={(e) => setEditingResv({ ...editingResv, phone: e.target.value })} placeholder="Telefon" />
              <select className="form-select my-2" value={editingResv.status} onChange={(e) => setEditingResv({ ...editingResv, status: e.target.value })}>
                <option value="pending">Ön Rezerve</option>
                <option value="confirmed">Kesin Rezerve</option>
              </select>
              <select className="form-select my-2" value={editingResv.eventType} onChange={(e) => setEditingResv({ ...editingResv, eventType: e.target.value })}>
                <option value="Düğün">Düğün</option>
                <option value="Nişan">Nişan</option>
                <option value="Sünnet">Sünnet</option>
                <option value="Kına Gecesi">Kına Gecesi</option>
                <option value="Organizasyon">Organizasyon</option>
              </select>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalVisible(false)}>Kapat</Button>
          <Button variant="primary" onClick={saveEditReservation}>Kaydet</Button>
        </Modal.Footer>
      </Modal>

      {/* Yeni Rezervasyon Modalı */}
      <Modal show={addModalVisible} onHide={() => setAddModalVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Rezervasyon Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input className="form-control my-2" value={newReservation.name} onChange={(e) => setNewReservation({ ...newReservation, name: e.target.value })} placeholder="İsim" />
          <input className="form-control my-2" value={newReservation.phone} onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })} placeholder="Telefon" />
          <select className="form-select my-2" value={newReservation.eventType} onChange={(e) => setNewReservation({ ...newReservation, eventType: e.target.value })}>
            <option value="Düğün">Düğün</option>
            <option value="Nişan">Nişan</option>
            <option value="Sünnet">Sünnet</option>
            <option value="Kına Gecesi">Kına Gecesi</option>
            <option value="Organizasyon">Organizasyon</option>
          </select>
          <input type="date" className="form-control my-2" value={newReservation.date} onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModalVisible(false)}>Kapat</Button>
          <Button variant="primary" onClick={addReservation}>Ekle</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
