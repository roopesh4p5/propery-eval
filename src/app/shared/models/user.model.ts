export interface User {
  id: number;
  email: string;
  name?: string;
  role: string;
  firstName?: string;
  lastName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
