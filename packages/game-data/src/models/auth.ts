import crypto from "crypto";

const salt = "da3d510718742990e1a8aafb166e59ea17f176d3783d7bcdbac5206c297c35dc";

export const Auth = {
  getHash(password: string): string {
    return crypto.scryptSync(password, salt, 32).toString("hex");
  },

  compare(plaintext: string, hash: string): boolean {
    return this.getHash(plaintext) === hash;
  },
};
