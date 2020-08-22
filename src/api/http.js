import { stringifyQuery } from '../utils'; 
import { getToken, removeToken } from '../utils/auth';
import { MessageBox, Message } from 'element-ui'

async function request(options) {
  let url =  process.env.VUE_APP_BASE_API+`${options.url}`;
  const init = {
    headers: {
      Authorization: `${getToken()}`,
      ...options.config?.headers,
    },
  };
  if (options.method === 'GET') {
    if (options.data) url += stringifyQuery(options.data);
  } else {
    init.method = options.method;
    init.headers['Content-Type'] = 'application/json';
    if (options.data) {
      init.body = JSON.stringify(options.data);
    }
  }
  const response = await fetch(url, init);
  const res = await response.json();

  if (res.code === 200) {
    return res;
  } else if (res.code === 401) {
    removeToken();
    location.href="/login"
    return '';
  } else {
    Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      }) 
    return '';
  }
  throw res;
}

export function get(url, data, config) {
  return request({ url, data, config, method: 'GET' });
}

export function post(url, data, config) {
  return request({ url, data, config, method: 'POST' });
}

export function put(url, data, config) {
  return request({ url, data, config, method: 'PUT' });
}

export function patch(url, data, config) {
  return request({ url, data, config, method: 'PATCH' });
}

export function del(url, data, config) {
  return request({ url, data, config, method: 'DELETE' });
}
