type User = {
  email: string
  password: string
  role:string 
}


const users: User[] = [
  {
  email:"don@don.com",
  password:"12345678",
  role:"admin"
},
  {
  email:"test@test.com",
  password:"12345678",
  role:"user"
}
]

export const addUser = (user: User) => {
  users.push(user)
}

export const findUser = (email: string) => {
  return users.find(u => u.email === email)
}
