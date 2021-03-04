import crypto from 'crypto';
const jwt = require('jsonwebtoken');
const { AuthenticationError, UserInputError } = require('apollo-server-micro');
const checkAuth = require('../lib/utils/check-auth');
import prisma from '../lib/prisma';
import { validateSigninInput, validateSignupInput } from '../lib/utils/validators';

const SECRET_KEY = process.env.JWT_SECRET;
function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
		SECRET_KEY,
		{ expiresIn: '1h' }
	);
}
export const resolvers = {
	Query: {
		me(_parent, _args, context, _info) {
			let user = null;
			try {
				user = checkAuth(context);
				// console.log('AUTH USER', user);
				return user;
			} catch (error) {
				// console.log(error.message);
			}

			return user;
		},
	},
	Mutation: {
		async signIn(_, { input: { email, password } }) {
			const { errors, valid } = validateSigninInput(email, password);

			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}
			const user = await prisma.user.findUnique({ where: { email } });
			if (!user) {
				console.log('Wrong crendetials');
				errors.general = 'Wrong crendetials';
				throw new UserInputError('Wrong crendetials', { errors });
			}
			const inputHash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
			const match = user.password === inputHash;
			if (!match) {
				console.log('Wrong crendetials');
				errors.general = 'Wrong crendetials';
				throw new UserInputError('Wrong crendetials', { errors });
			}

			const token = generateToken(user);

			return {
				...user,
				token,
			};
		},
		async signUp(_, { input: { name, email, password } }) {
			// Validate user data
			const { valid, errors } = validateSignupInput(name, email, password);
			if (!valid) {
				throw new UserInputError('Errors', { errors });
			}
			// Make sure user doesnt already exist
			try {
				const existingUser = await prisma.user.findUnique({ where: { email } });
				if (existingUser) {
					console.log(existingUser);
					throw new UserInputError('Email already exists', {
						errors: {
							name: 'This email is already taken',
						},
					});
				}
				const salt = crypto.randomBytes(16).toString('hex');
				const hashedPass = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
				const newUser = {
					name,
					email,
					password: hashedPass,
					salt,
					role: 'Admin',
				};
				const user = await prisma.user.create({
					data: newUser,
				});
				const token = generateToken(user);

				return {
					...user,
					token,
				};
			} catch (err) {
				console.log(err);
				throw new Error(err.message);
			}
		},
	},
};
