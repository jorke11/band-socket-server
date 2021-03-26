
const app = require("express")()
const cors = require("cors")
const Band = require("./models/band")
const Bands = require("./models/bands")

const http = require("http").Server(app)
const io = require("socket.io")(http,{
    cors:{
        methods:["GET","POST"]
    }
})


app.use(cors())

app.get("/",(req,res)=>{
    res.json({
        ok:true
    })
})

const bands = new Bands()

bands.addBand(new Band("Queen"))
bands.addBand(new Band("Queen2"))
bands.addBand(new Band("Queen3"))
bands.addBand(new Band("Queen4"))

console.log('bands',bands);

io.on("connection",(socket)=>{
    console.log('client connected',socket.id);
    socket.broadcast.emit("greeting",{msg:"Welcome",user:'user_'+socket.id})
    socket.emit("greeting",{msg:"Welcome",user:'user_'+socket.id})

    socket.emit("active-bands",bands.getBands())

    socket.on("nuevo-mensaje",(data)=>{
        console.log('nuevo-mensaje',data);
    })

    socket.on("vote-band",(data)=>{
        console.log('vote',data);
        bands.voteBand(data.id)
        console.log('this.getBands()',bands.getBands());
        io.emit("active-bands",bands.getBands())

    })

    socket.on("add-band",(data)=>{
        const newBand = new Band(data.name)
        bands.addBand(newBand)
        console.log('this.getBands()',bands.getBands());
        io.emit("active-bands",bands.getBands())

    })

    socket.on("delete-band",(data)=>{
        bands.deleteBand(data.id)
        console.log('this.getBands()',bands.getBands());
        io.emit("active-bands",bands.getBands())

    })
})

http.listen(5000,()=>{
    console.log('lisnte port 5000');
});