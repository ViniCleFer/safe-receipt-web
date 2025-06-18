import LoginPage from './login/page';
import DashboardPage from './dashboard/page';

import { getSession } from './actions';

export default async function Home() {
  const session = await getSession();

  return session === null ||
    session?.user?.user_metadata?.permissions?.length === 0 ||
    !session?.user?.user_metadata?.permissions?.includes('WEB') ? (
    <LoginPage />
  ) : (
    <DashboardPage />
  );
}
