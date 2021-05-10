const admin = require("firebase-admin");

const {
  FIREBASE_TYPE,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  FIREBASE_AUTH_PROVIDER_X500_CERT_URL,
  FIREBASE_CLIENT_X509_CERT_URL,
} = process.env;

const serviceAccount = {
  type: FIREBASE_TYPE,
  project_id: FIREBASE_PROJECT_ID,
  private_key_id: FIREBASE_PRIVATE_KEY_ID,
  private_key: FIREBASE_PRIVATE_KEY,
  client_email: FIREBASE_CLIENT_EMAIL,
  client_id: FIREBASE_CLIENT_ID,
  auth_uri: FIREBASE_AUTH_URI,
  token_uri: FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: FIREBASE_AUTH_PROVIDER_X500_CERT_URL,
  client_x509_cert_url: FIREBASE_CLIENT_X509_CERT_URL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const authenticateUser = async (idToken) => {
  const { name, email, uid } = await admin
    .auth()
    .verifyIdToken(idToken);

  return { name, email, uid };
};

exports.authenticateUser = authenticateUser;
