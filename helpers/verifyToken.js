import { OAuth2Client } from "google-auth-library";
import config from "../config.js";

const client = new OAuth2Client(config.googleClientId);

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
  });

  const payload = ticket.getPayload();
  const userid = payload['sub'];

  return payload
}

export default verify;