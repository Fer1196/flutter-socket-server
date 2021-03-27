const { io } = require('../index');
const Band = require('../models/band');

const Bands = require('../models/bands');
const bands = new Bands();

bands.addBand(new Band('Zahiro'));
bands.addBand(new Band('Equilivre'));
bands.addBand(new Band('The Weekend'));
bands.addBand(new Band('The ousider'));

console.log(bands);

//Mensajes de Sockets
io.on('connection', client => {

    console.log('Cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mnesaje', payload)
        io.emit('mensaje', { admin: 'Nuevo mensaje' })
    });

    /*client.on('emitir-mensaje', (payload) => {
        // para emitir a todos hasta el que envio
        //io.emit('nuevo-mensaje', payload)

        //Para emitir solo a la persona que emitio 
        client.broadcast.emit('nuevo-mensaje', payload);

        //console.log(payload);
    });*/

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        //Para Notificar a todos 
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        console.log(payload);
        bands.addBand(new Band(payload.name));
        //Para Notificar a todos 
        io.emit('active-bands', bands.getBands());
        console.log(bands.getBands());
    });

    client.on('delete-band', (payload) => {
        console.log(payload);
        bands.deleteBand(payload.id);
        //Para Notificar a todos 
        io.emit('active-bands', bands.getBands());
        console.log(bands.getBands());
    });

});