export const RoleRoutes:any = {
    admin: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions', '/users'],
    doctor: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions'],
    nurse: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions'],
    pharmacist: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions'],
    medLabScientist: ['/dashboard', '/patients', '/patients/:id'],
    user: ['/login', '/register'],
    guest: ['/login', '/register'],
  };