require('dotenv').config();

exports.formatToLocalTimestamp = (date) => {
	const d = new Date(date);
	const pad = (n) => (n < 10 ? "0" + n : n);
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  
  exports.generateToken = (id) => {
	const Jwt = require("@hapi/jwt");
	return Jwt.token.generate(
	  { id, aud: "urn:audience:test", iss: "urn:issuer:test" },
	  { key: process.env.JWT_SECRET, algorithm: "HS256" }
	);
  };
  