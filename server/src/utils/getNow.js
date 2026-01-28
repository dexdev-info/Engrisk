// utils/getNow.js
export const getNow = (req) => {
  if (req.query.mockDate) {
    const mock = new Date(req.query.mockDate)
    if (!isNaN(mock.getTime())) {
      return mock
    }
  }
  return new Date()
}
