import LoginPage from './login/page';
import DashboardPage from './dashboard/page';

import { getSession } from './actions';

export default async function Home() {
  const session = await getSession();

  console.log('session', session);

  return session === null ? <LoginPage /> : <DashboardPage />;
}
