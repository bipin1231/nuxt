type User = {
  email: string
  password: string
}


const users: User[] = []

export const addUser = (user: User) => {
  users.push(user)
}

export const findUser = (email: string) => {
  return users.find(u => u.email === email)
}
