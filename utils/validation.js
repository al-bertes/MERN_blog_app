import { body } from "express-validator";

export const registerValidator = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'пароль должен быть минимум 8 символов').isLength({min: 5}),
  body('fullName').isLength({ min: 3}),
  body('avatarUrl').optional().isURL()
]

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'пароль должен быть минимум 8 символов').isLength({min: 5}),
]

export const postCreateValidation = [
  body('title', 'Пустой заголовок').isLength({min: 3}).isString(),
  body('text', 'Текст пустой').isLength({min: 10}).isString(),
  body('tags', 'Неверный формат тегов(укажите массив)').optional().isArray(),
  body('imageUrl').optional().isString()
]