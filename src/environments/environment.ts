// const apiBaseUrl= 'http://localhost:3000'; // Base URL for your backend
const apiBaseUrl = 'https://thick-vanda-jaystechub-9e5d8dcc.koyeb.app/'; // Base URL for your backend

export const environment = {
  production: false,

  authUrl: `${apiBaseUrl}/auth`,
  userUrl: `${apiBaseUrl}/user`,
  patientUrl: `${apiBaseUrl}/patient`,
  drugUrl: `${apiBaseUrl}/drug`,
  dashboardUrl: `${apiBaseUrl}/dashboard`,
  prescriptionUrl: `${apiBaseUrl}/prescriptions`,
};
