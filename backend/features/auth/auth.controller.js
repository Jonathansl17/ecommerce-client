import {
  registrar as registrarService,
  iniciarSesion as iniciarSesionService,
  rotarRefresh as rotarRefreshService,
  revocarSesion as revocarSesionService,
  obtenerUsuarioActivo,
} from './auth.service.js';
import {
  AUTH_MESSAGES,
  AUTH_CONFIG,
  COOKIE_NAMES,
  buildCookieOptions,
} from './auth.constants.js';
import { HTTP_STATUS } from '../../shared/constants/http.constants.js';

const setAuthCookies = (res, { accessToken, refreshToken, refreshExpiresAt }) => {
  res.cookie(COOKIE_NAMES.ACCESS, accessToken, buildCookieOptions(AUTH_CONFIG.ACCESS_TOKEN_MAX_AGE_MS));
  const refreshMaxAge = Math.max(0, refreshExpiresAt.getTime() - Date.now());
  res.cookie(
    COOKIE_NAMES.REFRESH,
    refreshToken,
    buildCookieOptions(refreshMaxAge, { forRefresh: true })
  );
};

const clearAuthCookies = (res) => {
  res.clearCookie(COOKIE_NAMES.ACCESS, { path: '/' });
  res.clearCookie(COOKIE_NAMES.REFRESH, { path: '/api/auth' });
};

export const registrar = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    await registrarService({ fullName, email, password });
    res.status(HTTP_STATUS.CREATED).json({ message: AUTH_MESSAGES.REGISTRO_EXITOSO });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken, refreshExpiresAt, usuario, notificaciones } =
      await iniciarSesionService({ email, password });

    setAuthCookies(res, { accessToken, refreshToken, refreshExpiresAt });

    return res.status(HTTP_STATUS.OK).json({
      message: AUTH_MESSAGES.INICIO_SESION_EXITOSO,
      usuario,
      notificaciones,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const rawRefresh = req.cookies?.[COOKIE_NAMES.REFRESH];
    const { accessToken, refreshToken, refreshExpiresAt, usuario } =
      await rotarRefreshService(rawRefresh);

    setAuthCookies(res, { accessToken, refreshToken, refreshExpiresAt });

    res.status(HTTP_STATUS.OK).json({
      message: AUTH_MESSAGES.SESION_RENOVADA,
      usuario,
    });
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const usuario = await obtenerUsuarioActivo(req.user.id);
    if (!usuario) {
      clearAuthCookies(res);
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: AUTH_MESSAGES.SESION_EXPIRADA });
    }
    res.status(HTTP_STATUS.OK).json({ usuario });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await revocarSesionService({
      rawRefresh: req.cookies?.[COOKIE_NAMES.REFRESH],
      accessJti: req.user?.jti,
      accessExp: req.user?.exp,
    });

    clearAuthCookies(res);
    return res.status(HTTP_STATUS.OK).json({ message: AUTH_MESSAGES.SESION_CERRADA });
  } catch (error) {
    next(error);
  }
};
