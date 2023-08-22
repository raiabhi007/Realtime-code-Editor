const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Action');

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const userSocketMap = {}; // isme socketID aur username save hoga {"socketId":"username"} ese format me, konsi socketId ka konsa user h is mapping se pta chalega, -> data memory me save hoga agar server restart hota h to ye null ho jayega


//isme saare clients ki list milegi jisme sare client honge jiki roomId send kri hui roomID se similar hogi return me ek object milega jisme socketID aur username rhega
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}



// EditorPage(client) se jo request aayegi usko listen krega
io.on('connection', (socket) => {
    console.log('socket connected', socket.id);
    //Join krne wali request ko listen krega jo editor page se aayegi
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId); // agar roomID phle se socket me hogi to ye use join kra dega agar ni hogi to create kr lega
        const clients = getAllConnectedClients(roomId);
        // loop lgakar notify kr rhe h ki kisi ne join kiya h
        clients.forEach(({ socketId }) => {
            // ye reequest frontend(Editor Page) pr listen hogi
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });


    
    //Editor pe jb code change hoga tb server pe ek request aayegi aur server same roomID ko changed code send kr dega.
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        //io.to agar socket.in ki jagah use krenge to request sbko jayegi typr krne walo ki bhi lekin socket.in me type krne wale ko chodkar sbko jayegi jo us room me available h
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    
    //jb koi new user aayega to code ko sync krne ke liye ye event response bheja jayega 
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });


    // ye tbhi run hoga jb koi brower band krta h ya leave krta h mtlb client disconnect krta h
    socket.on('disconnecting', () => {
        // socket ke saare rooms mil jayenge yahan pr
        const rooms = [...socket.rooms];
        //roomId jisme se delete krna h bo saare filter krenge loop lgakar
        rooms.forEach((roomId) => {
            //frontend pr notify krega ki ye disconnect ho gya h ye sb clients ke pass jayega isko emit kr rhe h to client pe listen krna pdega
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        // userSocketMap se delete kr dega
        delete userSocketMap[socket.id];
    // kisi room se officially bahar nikalne ke liye ye method hoti h
        socket.leave();
    });
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));