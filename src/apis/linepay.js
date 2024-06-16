import { apiHelper } from './../utils/axios'

export default {
  async LinePayConfirm(transactionId, orderId) {
    try {
      const response = await apiHelper.post('line-pay/handle', {
        transactionId,
        orderId
      })
      
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}