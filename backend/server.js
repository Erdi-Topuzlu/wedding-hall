import express from 'express';
import path from "path";
import fs from 'fs';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;
const reservationsFile = './reservations.json';

// Bu iki satır, __dirname'i ESM modülüyle kullanmak için:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// React build klasörünü statik olarak sun
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Diğer tüm istekleri React’in index.html’ine yönlendir (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});