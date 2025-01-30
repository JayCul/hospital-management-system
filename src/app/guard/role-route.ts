export const RoleRoutes:any = {
    admin: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions', '/users','/login', '/register'],
    doctor: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions', '/login', '/register'],
    nurse: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions', '/login', '/register'],
    pharmacist: ['/dashboard', '/patients', '/patients/:id', '/drug-database', '/prescriptions', '/login', '/register'],
    medLabScientist: ['/dashboard', '/patients', '/patients/:id'],
    user: ['/login', '/register'],
    guest: ['/login', '/register'],
  };