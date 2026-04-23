const isGuestMode = ref(false);

const guestUser = {
  id: 0,
  login: 'guest',
  name: 'Demo User',
  bio: 'Try out the habit tracker without signing in!',
  avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=DU&backgroundColor=22c55e',
  createdAt: new Date(),
  userView: true,
};

export function useGuestMode() {
  const enterGuestMode = () => {
    isGuestMode.value = true;
  };

  const exitGuestMode = () => {
    isGuestMode.value = false;
  };

  return {
    isGuestMode,
    guestUser,
    enterGuestMode,
    exitGuestMode,
  };
}
