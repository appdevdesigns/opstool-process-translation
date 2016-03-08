module.exports.sockets = {
	afterDisconnect: function (session, socket, cb) {
		ADCore.queue.publish('opsportal.socket.disconnect', socket);
		
		return cb();
	}
};