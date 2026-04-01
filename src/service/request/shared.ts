import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;

  return Authorization;
}

/** 刷新 Token */
async function handleRefreshToken() {
  const { resetStore } = useAuthStore();

  const rToken = localStg.get('refreshToken') || '';
  const { error, data } = await fetchRefreshToken(rToken);
  if (!error) {
    localStg.set('token', data.token);
    localStg.set('refreshToken', data.refreshToken);
    return true;
  }

  resetStore();

  return false;
}

export async function handleExpiredRequest(state: RequestInstanceState) {
  if (!state.refreshTokenPromise) {
    state.refreshTokenPromise = handleRefreshToken();
  }

  const success = await state.refreshTokenPromise;

  setTimeout(() => {
    state.refreshTokenPromise = null;
  }, 1000);

  return success;
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);

  if (!isExist) {
    state.errMsgStack.push(message);

    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      }
    });
  }
}
/**
 * 处理服务错误
 *
 * @param error
 */
export function handleServiceError(error: any) {
  let message = error.message || $t('common.error');

  if (error.response) {
    const { status, data } = error.response;

    // 如果后端提供了错误消息，优先使用
    if (data?.msg) {
      return data.msg;
    }

    // 将常见的状态码映射到与协议一致的消息
    const statusMap: Record<number, string> = {
      400: $t('request.error400') || '请求参数错误',
      401: $t('request.error401') || '登录身份已过期',
      403: '权限不足 (非管理员)',
      404: $t('request.error404') || '资源未找到',
      405: '请求方法不允许',
      500: '服务器繁忙，请重新加载 (500)',
      502: '网关错误 (502)',
      503: '服务不可用 (503)',
      504: '网关超时 (504)'
    };

    if (statusMap[status]) {
      message = statusMap[status];
    }
  }

  return message;
}
