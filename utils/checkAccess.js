export const accessRole = (key) => {
  let list = JSON.parse(sessionStorage.getItem("role"))
  return list[key]?.map((res) => res.event)
}
export const accessRoleMenu = () => {
  let list = JSON.parse(sessionStorage.getItem("role"))
  return Object.keys(list)
}