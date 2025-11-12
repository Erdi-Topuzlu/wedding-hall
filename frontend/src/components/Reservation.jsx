import React, { useState, useEffect } from 'react';

function startOfDay(d){ const x = new Date(d); x.setHours(0,0,0,0); return x; }
function isAvailableWeekday(date){ const w = date.getDay(); return w===5 || w===6 || w===0; }
function formatDate(d){ return d.toLocaleDateString('tr-TR', {weekday:'short', day:'numeric', month:'short', year:'numeric'}); }

export default function Reservation({compact}) {
  const startDate = new Date(2025,0,1); // 2025 başından itibaren
  const today = startOfDay(new Date() > startDate ? new Date() : startDate);
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [availableDates, setAvailableDates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [existingReservations, setExistingReservations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [formData, setFormData] = useState({
    name:'',
    phone:'',
    eventType:'Düğün'
  });

  const [success, setSuccess] = useState(null);

  // GET mevcut rezervasyonları al
  useEffect(()=>{
    fetch('/api/reservations')
      .then(res=>res.json())
      .then(data=>setExistingReservations(data))
      .catch(err=>console.error(err));
  },[]);

  // WebSocket live update
  useEffect(()=>{
    const ws = new WebSocket('ws://localhost:5001');
    ws.onmessage = (msg)=>{
      const data = JSON.parse(msg.data);
      if(data.type==='update') setExistingReservations(data.reservations);
    };
    return ()=>ws.close();
  },[]);

  // Ayın müsait günlerini hesapla
  useEffect(() => {
  const dates = [];
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  for(let d = first.getDate(); d <= last.getDate(); d++){
    const dt = new Date(year, month, d);
    if(startOfDay(dt) < today) continue;
    if(isAvailableWeekday(dt)) dates.push(dt);
  }

  // Sadece değişirse setState yap
  setAvailableDates(prev => {
    // Önce string'e çevirip karşılaştırabiliriz
    const prevStr = prev.map(d => d.toDateString()).join(',');
    const newStr = dates.map(d => d.toDateString()).join(',');
    return prevStr === newStr ? prev : dates;
  });

}, [currentMonth]); // artık sadece currentMonth bağımlı

  function nextMonth(){ setCurrentMonth(prev=> new Date(prev.getFullYear(), prev.getMonth()+1, 1)); }
  function prevMonth(){ setCurrentMonth(prev=> new Date(prev.getFullYear(), prev.getMonth()-1, 1)); }

  const getBadge = (d)=>{
    const r = existingReservations.find(r=>new Date(r.date).toDateString()===d.toDateString());
    if(!r) return <span className="badge bg-success">Müsait</span>;
    if(r.status==='pending') return <span className="badge bg-warning text-dark">Ön Rezerve</span>;
    if(r.status==='confirmed') return <span className="badge bg-danger">Kesin Rezerve</span>;
  }

  const handleDayClick = (d)=>{
    const r = existingReservations.find(r=>new Date(r.date).toDateString()===d.toDateString());
    if(r && (r.status==='pending' || r.status==='confirmed')) return; // tıklanamaz
    setSelected(d);
    setModalVisible(true);
  }

  const submit = async (e)=>{
    e.preventDefault();
    if(!selected) return;
    const body = {
      ...formData,
      date:selected.toISOString(),
      createdAt: new Date().toISOString(),
      status:'pending'
    };
    try{
      const res = await fetch('/api/reservations',{method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body)});
      if(!res.ok) throw new Error('Kayıt başarısız');
      setSuccess(true);
      setFormData({name:'', phone:'', eventType:'Düğün'});
      setSelected(null);
      setModalVisible(false);
    }catch(err){
      console.error(err);
      setSuccess(false);
    }
  }

  return (
    <div className={compact?'card p-3':'container my-5'}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={prevMonth}>&lt;</button>
          <strong>{currentMonth.toLocaleString('tr-TR',{month:'long',year:'numeric'})}</strong>
          <button className="btn btn-outline-secondary ms-2" onClick={nextMonth}>&gt;</button>
        </div>
      </div>

      <div className="row g-2">
        {availableDates.length===0 && <div className="col-12">Bu ay için müsait gün yok.</div>}
        {availableDates.map((d,idx)=>(
          <div key={idx} className="col-12 col-sm-6 col-md-4">
            <div className={`card p-3 available-day ${selected && selected.toDateString()===d.toDateString()?'border-primary':''}`} onClick={()=>handleDayClick(d)}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-bold">{formatDate(d)}</div>
                  <small>{['Cuma','Cumartesi','Pazar'][ [5,6,0].indexOf(d.getDay()) ]}</small>
                </div>
                <div>{getBadge(d)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalVisible &&
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={submit}>
                <div className="modal-header">
                  <h5 className="modal-title">Rezervasyon - {selected && formatDate(selected)}</h5>
                  <button type="button" className="btn-close" onClick={()=>setModalVisible(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Ad Soyad</label>
                    <input required className="form-control" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Telefon</label>
                    <input required className="form-control" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Etkinlik Türü</label>
                    <select required className="form-select" value={formData.eventType} onChange={e=>setFormData({...formData,eventType:e.target.value})}>
                      <option>Düğün</option>
                      <option>Nişan</option>
                      <option>Sünnet</option>
                      <option>Kına Gecesi</option>
                      <option>Organizasyon</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={()=>setModalVisible(false)}>Kapat</button>
                  <button type="submit" className="btn btn-primary">Rezervasyon Yap</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }

      {success===true && <div className="alert alert-success mt-3">Rezervasyon başarıyla kaydedildi.</div>}
      {success===false && <div className="alert alert-danger mt-3">Kaydetme sırasında hata oluştu.</div>}
    </div>
  )
}
