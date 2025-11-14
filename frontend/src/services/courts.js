import api from './api';

export const courtsService = {
  async getAllCourts() {
    const response = await api.get('/api/courts');
    return response.data;
  },

  async getCourtById(id) {
    const response = await api.get(`/api/courts/${id}`);
    return response.data;
  },

  async getAvailableSlots(courtId, date) {
    const response = await api.get(`/api/courts/${courtId}/available-slots`, {
      params: { date }
    });
    return response.data;
  },

  async createCourt(courtData) {
    const response = await api.post('/api/courts', courtData);
    return response.data;
  },

  async updateCourt(id, courtData) {
    const response = await api.put(`/api/courts/${id}`, courtData);
    return response.data;
  },

  async deleteCourt(id) {
    const response = await api.delete(`/api/courts/${id}`);
    return response.data;
  },
};
