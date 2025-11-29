import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';


/* En este archivo habría que incluir la función que verifica el JWT token

y

constantes, si las hubiera

y

la funcion de hasheo de contraseña, que ya la tenemos en principio:*/


export const hashPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
	if(!req.body.password){
		return next();
	}
	//console.log(req.body.password);
	const password = req.body.password;
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	req.body.password = hashedPassword;
	//console.log(req.body.password);
	next();

  } catch (error) {
    res.status(500).json({ error: 'Error al hashear la contraseña' });
  }
};
