export const RoleRoutes:any = {
    admin: ['/dashboard', '/admin', '/settings', '/users'],
    doctor: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions', '/users'],
    nurse: ['/dashboard', '/patients', '/drug', '/prescriptions'],
    pharmacist: ['/dashboard', '/patients', '/drug', '/prescriptions'],
    medLabScientist: ['/dashboard', '/patients'],
    user: [''],
    guest: ['/login', '/register'],
  };