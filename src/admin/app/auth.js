export function isAdminAuth() {
  return localStorage.getItem('adminAuth') === 'true'
}

export function logoutAdmin() {
  localStorage.removeItem('adminAuth')
  localStorage.removeItem('adminLogin')
}
