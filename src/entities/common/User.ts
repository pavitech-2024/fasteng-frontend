/**
 * @class @description
 * This is a class that represents the user entity. It is used to create a user object that will be used in the application.
 *
 */
export default class User {
  _id: string;
  lastLoginList: Date[];
  photo: string | null;
  connections: number;
  name: string;
  email: string;
  planName: string;

  constructor(
    _id: string,
    lastLoginList: Date[],
    photo: string | null,
    connections: number,
    name: string,
    email: string,
    planName: string
  ) {
    this._id = _id;
    this.lastLoginList = lastLoginList;
    this.photo = photo;
    this.connections = connections;
    this.name = name;
    this.email = email;
    this.planName = planName;
  }
}
