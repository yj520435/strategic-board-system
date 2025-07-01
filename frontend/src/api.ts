import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api/pt',
});

export async function getList(strategy: string, page: number, size: number) {
  const response = await axiosInstance.get('/posts', {
    params: {
      strategy: strategy.toUpperCase(),
      page: page - 1,
      size,
    },
  });
  return response.data;
}

export async function getPost(id: number) {
  const response = await axiosInstance.get(`/post/${id}`);
  return response.data;
}
