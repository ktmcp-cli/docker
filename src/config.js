import Conf from 'conf';
const conf = new Conf({ projectName: 'ktmcp-docker' });
export function getConfig(key) { return conf.get(key); }
export function setConfig(key, value) { conf.set(key, value); }
export function isConfigured() { return !!conf.get('baseUrl'); }
export function getBaseUrl() { return conf.get('baseUrl') || 'http://localhost/v1.33'; }
