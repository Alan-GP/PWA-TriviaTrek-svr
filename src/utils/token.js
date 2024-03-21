const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

const tokenSecret = '5tbZ(tfLcW6FXVmT@58%UvT&9Pohhs93';

const generarTokenSesion = (usuarioId) => {
	const token = jwt.sign({
		usuarioId: usuarioId,
		plataforma: 'Web',
	},
		tokenSecret,
		{
			audience: ['TRIVIATREK'],
			expiresIn: '5h',
			issuer: 'TRIVIATREK',
		});
	return token;
};

const validarTokenGenrada = (req, res, next) => {
	if (req.headers.authorization) {
		const auth = req.headers.authorization;
		const token = auth.split(' ')[1];
		try {
			const decoded = jwt.verify(token, tokenSecret);

			if (decoded) {
				next();
			} else {
				res.sendStatus(401);
			}
		} catch (e) {
			res.sendStatus(401);
		}
	} else {
		res.sendStatus(401);
	}
};

const validarToken = async (req, res, next) => {
	if (req.headers.authorization) {
	  const auth = req.headers.authorization;
	  const token = auth.split(' ')[1];
  
	  try {
		// Verifica el token utilizando el SDK de Firebase
		const decodedToken = await admin.auth().verifyIdToken(token);
		
		// La verificación fue exitosa, el token es válido
		// Puedes acceder a la información del usuario a través de decodedToken
		req.user = decodedToken;
		next();
	  } catch (error) {
		console.error('Error al verificar el token de Firebase:', error);
		res.sendStatus(401);
	  }
	} else {
	  res.sendStatus(401);
	}
  };

const renovarToken = (req) => {
	const auth = req.headers?.authorization;
	let token = auth?.split(' ')[1];
	const decoded = jwt.verify(token, tokenSecret);
	//console.log(decoded);ñ
	// eslint-disable-next-line no-constant-condition
	if ((decoded.plataforma == 'Web')) {
		token = generarTokenSesion(decoded.usuarioId);
	}
	//console.log(jwt.verify(token, tokenSecret));
	return token;
};

module.exports = {
	validarToken,
	generarTokenSesion,
	renovarToken,
};