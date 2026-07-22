import { DashboardRepository } from "../repositories/dashboard.repository.js";

export const DashboardService = {
  async getSummary() {
    return DashboardRepository.getSummary();
  },

  async getStatusCounts() {
    const data = await DashboardRepository.getStatusCounts();

    return data.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  },

  async getPriorityCounts() {
    const data = await DashboardRepository.getPriorityCounts();

    return data.map((item) => ({
      priority: item.priority,
      count: item._count.priority,
    }));
  },

  async getDepartmentCounts() {
    return DashboardRepository.getDepartmentCounts();
  },

  async getCategoryCounts() {
    return DashboardRepository.getCategoryCounts();
  },

  async getRecentTickets(limit?: number) {
    return DashboardRepository.getRecentTickets(limit);
  },

  async getRecentActivities(limit?: number) {
    return DashboardRepository.getRecentActivities(limit);
  },

  async getAgentPerformance() {
    return DashboardRepository.getAgentPerformance();
  },
};