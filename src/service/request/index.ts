import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { getAuthorization, handleExpiredRequest, handleServiceError, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

/** 通用请求配置工厂 */
// @ts-ignore
function createCommonOptions(instance: any) {
  return {
    defaultState: {
      errMsgStack: [],
      refreshTokenPromise: null
    } as RequestInstanceState,
    transform(response: AxiosResponse<App.Service.Response<any>>) {
      return response.data.data;
    },
    async onRequest(config: any) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },
    isBackendSuccess(response: any) {
      // 当后端返回码为 "200"（默认）时，表示请求成功
      // 如果要修改此逻辑，可以修改 .env 文件中的 `VITE_SERVICE_SUCCESS_CODE`
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async onBackendFail(response: any, requestInstance: any) {
      const authStore = useAuthStore();
      const responseCode = String(response.data.code);

      function handleLogout() {
        authStore.resetStore();
      }

      function logoutAndCleanup() {
        handleLogout();
        window.removeEventListener('beforeunload', handleLogout);

        requestInstance.state.errMsgStack = requestInstance.state.errMsgStack.filter(
          (msg: string) => msg !== response.data.msg
        );
      }

      // 当后端返回码在 `logoutCodes` 中时，表示用户将退出登录并重定向到登录页面
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        handleLogout();
        return null;
      }

      // 当后端返回码在 `modalLogoutCodes` 中时，表示将通过显示模态框来登出用户
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(responseCode) && !requestInstance.state.errMsgStack?.includes(response.data.msg)) {
        requestInstance.state.errMsgStack = [...(requestInstance.state.errMsgStack || []), response.data.msg];

        // 防止用户刷新页面
        window.addEventListener('beforeunload', handleLogout);

        window.$dialog?.error({
          title: $t('common.error'),
          content: response.data.msg,
          positiveText: $t('common.confirm'),
          maskClosable: false,
          closeOnEsc: false,
          onPositiveClick() {
            logoutAndCleanup();
          },
          onClose() {
            logoutAndCleanup();
          }
        });

        return null;
      }

      // 当后端返回码在 `expiredTokenCodes` 中时，表示 Token 已过期，需要刷新 Token
      // 接口 `refreshToken` 不能返回 `expiredTokenCodes` 中的错误码，否则会进入死循环，应返回 `logoutCodes` 或 `modalLogoutCodes`
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(responseCode)) {
        const success = await handleExpiredRequest(requestInstance.state);
        if (success) {
          const Authorization = getAuthorization();
          Object.assign(response.config.headers, { Authorization });

          return requestInstance.request(response.config) as Promise<AxiosResponse>;
        }
      }

      return null;
    },
    onError(error: any) {
      // 当请求失败时，可以显示错误消息

      let message = error.message;
      let backendErrorCode = '';

      // 获取后端错误消息和错误码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code || '');
      } else {
        // 处理 HTTP 状态码错误
        message = handleServiceError(error);
      }

      // 错误消息已在模态框中显示
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      // 当 Token 过期时，刷新 Token 并重试请求，因此无需显示错误消息
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      showErrorMsg(instance.state, message);
    }
  };
}

/** 默认请求实例 (/api) */
export const request = createFlatRequest(
  {
    baseURL
  },
  createCommonOptions(null)
);

/** 管理后台请求实例 (/api/admin) */
export const adminRequest = createFlatRequest(
  {
    baseURL: `${baseURL}/admin`
  },
  createCommonOptions(null)
);

/** V1 业务请求实例 (/api/v1) */
export const v1Request = createFlatRequest(
  {
    baseURL: `${baseURL}/v1`
  },
  createCommonOptions(null)
);

/** 演示示例请求实例 */
export const demoRequest = createRequest(
  {
    baseURL: otherBaseURL.demo
  },
  {
    transform(response: AxiosResponse<App.Service.DemoResponse>) {
      return response.data.result;
    },
    async onRequest(config) {
      const { headers } = config;

      // 设置 token
      const token = localStg.get('token');
      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // 当后端返回码为 "200" 时，表示请求成功
      // 你可以根据需要修改此逻辑
      return response.data.status === '200';
    },
    async onBackendFail(_response) {
      // 当后端返回码不为 "200" 时，表示请求失败
      // 例如：Token 已过期，刷新 Token 并重试请求
    },
    onError(error) {
      // 当请求失败时，可以显示错误消息

      let message = error.message;

      // 显示后端错误消息
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    }
  }
);
