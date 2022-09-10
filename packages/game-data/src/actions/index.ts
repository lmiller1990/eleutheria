import { DbActions } from "./db"

export class DataActions {
  get db () {
    return new DbActions()
  }
}