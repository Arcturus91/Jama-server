export enum UserType {
  USER = 'user',
  CHEF = 'chef',
  ADMIN = 'admin',
}

export const jwtConstants = {
  secret: 'gato',
};

export enum OrderStatus {
  requested = 'requested',
  onCooking = 'onCooking',
  onDelivery = 'onDelivery',
  completed = 'completed',
}
