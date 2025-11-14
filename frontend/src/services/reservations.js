import api from './api';

export const reservationsService = {
  async createReservation(reservationData) {
    const response = await api.post('/api/reservations', reservationData);
    return response.data;
  },

  async getMyReservations() {
    const response = await api.get('/api/reservations/my-reservations');
    return response.data;
  },

  async getAllReservations() {
    const response = await api.get('/api/reservations/all');
    return response.data;
  },

  async getReservationById(id) {
    const response = await api.get(`/api/reservations/${id}`);
    return response.data;
  },

  async cancelReservation(id) {
    const response = await api.delete(`/api/reservations/${id}`);
    return response.data;
  },
};
