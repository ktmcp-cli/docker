import axios from 'axios';
import { getBaseUrl } from './config.js';

function getClient() {
  const baseURL = getBaseUrl();
  return axios.create({
    baseURL,
    socketPath: '/var/run/docker.sock',
    headers: { 'Content-Type': 'application/json' }
  });
}

// Containers
export async function listContainers(params = {}) {
  const client = getClient();
  const res = await client.get('/containers/json', { params });
  return res.data;
}

export async function inspectContainer(id) {
  const client = getClient();
  const res = await client.get(`/containers/${id}/json`);
  return res.data;
}

export async function createContainer(config) {
  const client = getClient();
  const res = await client.post('/containers/create', config);
  return res.data;
}

export async function startContainer(id) {
  const client = getClient();
  const res = await client.post(`/containers/${id}/start`);
  return res.data;
}

export async function stopContainer(id) {
  const client = getClient();
  const res = await client.post(`/containers/${id}/stop`);
  return res.data;
}

export async function removeContainer(id) {
  const client = getClient();
  const res = await client.delete(`/containers/${id}`);
  return res.data;
}

export async function getContainerLogs(id, params = {}) {
  const client = getClient();
  const res = await client.get(`/containers/${id}/logs`, { params });
  return res.data;
}

// Images
export async function listImages(params = {}) {
  const client = getClient();
  const res = await client.get('/images/json', { params });
  return res.data;
}

export async function inspectImage(name) {
  const client = getClient();
  const res = await client.get(`/images/${name}/json`);
  return res.data;
}

export async function pullImage(name) {
  const client = getClient();
  const res = await client.post('/images/create', null, { params: { fromImage: name } });
  return res.data;
}

export async function removeImage(name) {
  const client = getClient();
  const res = await client.delete(`/images/${name}`);
  return res.data;
}

// Networks
export async function listNetworks(params = {}) {
  const client = getClient();
  const res = await client.get('/networks', { params });
  return res.data;
}

export async function inspectNetwork(id) {
  const client = getClient();
  const res = await client.get(`/networks/${id}`);
  return res.data;
}

export async function createNetwork(config) {
  const client = getClient();
  const res = await client.post('/networks/create', config);
  return res.data;
}

export async function removeNetwork(id) {
  const client = getClient();
  const res = await client.delete(`/networks/${id}`);
  return res.data;
}

// Volumes
export async function listVolumes(params = {}) {
  const client = getClient();
  const res = await client.get('/volumes', { params });
  return res.data;
}

export async function inspectVolume(name) {
  const client = getClient();
  const res = await client.get(`/volumes/${name}`);
  return res.data;
}

export async function createVolume(config) {
  const client = getClient();
  const res = await client.post('/volumes/create', config);
  return res.data;
}

export async function removeVolume(name) {
  const client = getClient();
  const res = await client.delete(`/volumes/${name}`);
  return res.data;
}

// System
export async function getSystemInfo() {
  const client = getClient();
  const res = await client.get('/info');
  return res.data;
}

export async function getVersion() {
  const client = getClient();
  const res = await client.get('/version');
  return res.data;
}

export async function ping() {
  const client = getClient();
  const res = await client.get('/_ping');
  return res.data;
}
