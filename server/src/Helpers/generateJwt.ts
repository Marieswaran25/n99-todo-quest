import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";


export function _genJWTToken(payload: Object): string|null {
	try {
		const token = jwt.sign(payload, JWT_SECRET, {
			algorithm: 'HS256',
			expiresIn: '1hr',
		});
		return token;
	} catch (error) {
		return null
	}
}

