import { useAuthStore } from "../stores/useAuthStore";
import GuestCasinoPage from "../pages/GuestCasinoPage";
import AutoRoulette from "../pages/AutoRoulette";

const ConditionalCasinoRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <GuestCasinoPage />; // show another page if not logged in
  }

  return <AutoRoulette />;
};

export default ConditionalCasinoRoute;
