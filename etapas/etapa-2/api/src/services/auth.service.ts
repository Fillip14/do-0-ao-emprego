import { AppError } from '../errors.js';
import { HttpStatus } from '../constants/http-constants.js';
import { registerSchema, loginSchema } from '../validation/auth.schema.js';
import { zodIssuesToDetails } from '../validation/to-error-details.js';
import * as usersRepository from '../repositories/users.repository.js';
import { hashPassword, comparePassword } from '../auth/password.js';
import { signToken } from '../auth/jwt.js';

// Mesma mensagem para "usuário não existe" e "senha errada" — mensagem
// diferente vaza se aquele e-mail está cadastrado (ver Tema 8, tópico 2).
const INVALID_CREDENTIALS_MESSAGE = 'E-mail ou senha inválidos';

export const register = async (input: unknown) => {
  const result = registerSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(
      'Invalid Registration',
      HttpStatus.BAD_REQUEST,
      undefined,
      zodIssuesToDetails(result.error.issues),
    );
  }

  const { email, password } = result.data;

  const existing = await usersRepository.findByEmail(email);
  // Aqui, ao contrário do login, dizer "e-mail já cadastrado" é a UX
  // padrão de cadastro — o cuidado de não vazar é específico do login.
  if (existing) throw new AppError('E-mail já cadastrado', HttpStatus.BAD_REQUEST, 'email');

  const passwordHash = await hashPassword(password);
  const user = await usersRepository.insert(email, passwordHash);

  return { token: signToken({ sub: user.id, email: user.email }) };
};

export const login = async (input: unknown) => {
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    throw new AppError(
      'Invalid Login',
      HttpStatus.BAD_REQUEST,
      undefined,
      zodIssuesToDetails(result.error.issues),
    );
  }

  const { email, password } = result.data;

  const user = await usersRepository.findByEmail(email);
  if (!user) throw new AppError(INVALID_CREDENTIALS_MESSAGE, HttpStatus.UNAUTHORIZED);

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) throw new AppError(INVALID_CREDENTIALS_MESSAGE, HttpStatus.UNAUTHORIZED);

  return { token: signToken({ sub: user.id, email: user.email }) };
};
