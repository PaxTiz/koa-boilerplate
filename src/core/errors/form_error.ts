/**
 * This class is intended to be used for create
 * form errors and returns formatted JSON responses
 * containing information about the bad fields
 */
export default class {
  /**
   * The name of the property
   */
  param: string;

  /**
   * Message to display to the user
   */
  msg: string;

  constructor(param: string, message: string) {
    this.param = param;
    this.msg = message;
  }
}
