export interface User {
  id: string
  name: string
  email: string
  mobile: string
  role: 'OWNER' | 'SEEKER'
  createdAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  genre?: string
  location: string
  contactInfo: string
  ownerId: string
  ownerName: string
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface SearchParams {
  query: string
  location: string
  genre: string
}
