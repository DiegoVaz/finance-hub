function status(request, response) {
  response.status(200).json({ status: 'Online' })
}

export default status
