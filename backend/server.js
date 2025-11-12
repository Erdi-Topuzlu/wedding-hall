import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const reservationsFile = './reservations.json';

// WebSocket server
const wss = new WebSocketServer({ port: 5001 });

function broadcastReservations() {
  fs.readFile(reservationsFile, 'utf8', (err, data) => {
    if(err) return console.error(err);
    const reservations = JSON.parse(data);
    wss.clients.forEach(client => {
      if(client.readyState === 1) {
        client.send(JSON.stringify({ type:'update', reservations }));
      }
    });
  });
}

// GET tüm rezervasyonları döner
app.get('/api/reservations', (req,res)=>{
  fs.readFile(reservationsFile,'utf8',(err,data)=>{
    if(err) return res.status(500).json({error:"Dosya okunamadı"});
    const reservations = JSON.parse(data);
    res.json(reservations);
  });
});

// PUT – düzenle, onayla veya sil
app.put('/api/reservations/:date', (req,res)=>{
  fs.readFile(reservationsFile,'utf8',(err,data)=>{
    if(err) return res.status(500).json({error:"Dosya okunamadı"});
    let reservations = JSON.parse(data);

    const idx = reservations.findIndex(r => new Date(r.date).toDateString() === new Date(req.params.date).toDateString());
    if(idx === -1) return res.status(404).json({error:"Rezervasyon bulunamadı"});

    if(req.body.status === 'deleted'){
      reservations.splice(idx,1); // JSON’dan sil
    } else {
      reservations[idx] = {...reservations[idx], ...req.body};
    }

    fs.writeFile(reservationsFile, JSON.stringify(reservations,null,2),(err)=>{
      if(err) return res.status(500).json({error:"Kaydedilemedi"});
      res.json({message:"Başarılı"});
      broadcastReservations();
    });
  });
});

// POST – yeni rezervasyon
app.post('/api/reservations', (req,res)=>{
  const newResv = {...req.body, status:'pending'};
  fs.readFile(reservationsFile,'utf8',(err,data)=>{
    let reservations = [];
    if(!err) reservations = JSON.parse(data);
    reservations.push(newResv);
    fs.writeFile(reservationsFile, JSON.stringify(reservations,null,2),(err)=>{
      if(err) return res.status(500).json({error:"Kaydedilemedi"});
      res.json({message:"Başarılı"});
      broadcastReservations();
    });
  });
});

app.listen(PORT, ()=>console.log(`Backend running on port ${PORT}`));
