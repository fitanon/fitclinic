<script setup lang="ts">
const { isGuestMode, guestUser, exitGuestMode } = useGuestMode();
const { habits } = useHabits();

const createHabitModal = ref(false);

onMounted(() => {
  if (!isGuestMode.value) {
    isGuestMode.value = true;
  }
});

const handleExit = async () => {
  exitGuestMode();
  await navigateTo('/');
};

const emptyHabits = computed(() => habits.value.length === 0);

useSeoMeta({
  title: 'Demo Mode · Habit Tracker',
  ogTitle: 'Demo Mode · Habit Tracker',
});
</script>

<template>
  <Card>
    <div class="relative z-10">
      <!-- Profile Header -->
      <div class="relative flex p-5">
        <div class="flex flex-col gap-3">
          <UAvatar size="3xl" :src="guestUser.avatarUrl" :alt="guestUser.login" />
          <div class="flex flex-col gap-1">
            <div class="text-xl font-medium">{{ guestUser.name }}</div>
            <div class="text-xs text-white/40">{{ guestUser.bio }}</div>
          </div>
        </div>
        <div class="absolute right-5 top-5 flex gap-3">
          <button class="button bg-white/20 py-1.5 pl-2 pr-2.5 hover:bg-white/25" @click="createHabitModal = true">
            <UIcon name="i-heroicons-plus-16-solid" class="h-5 w-5" />
            Create
          </button>
          <UPopover :popper="{ placement: 'bottom-end' }" :ui="{ background: '', shadow: '', ring: '' }">
            <button class="button bg-white/10 p-1.5 hover:bg-white/25">
              <UIcon name="i-heroicons-cog-6-tooth-20-solid" class="h-5 w-5" />
            </button>
            <template #panel="{ close }">
              <div class="dropdown">
                <a
                  href="/api/auth/github"
                  class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30">
                  <UIcon name="i-simple-icons-github" class="h-5 w-5" />
                  <span>Sign in with GitHub</span>
                </a>
                <div class="border-b border-white/5"></div>
                <div
                  @click="() => { close(); handleExit(); }"
                  class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30">
                  <UIcon name="i-heroicons-arrow-left-on-rectangle-20-solid" class="h-5 w-5" />
                  <span>Exit Demo</span>
                </div>
              </div>
            </template>
          </UPopover>
        </div>
      </div>

      <!-- Habits List -->
      <div class="scrollable-card max-h-[calc(100vh-18.875rem)] overflow-y-auto">
        <GuestHabitCard v-for="habit in habits" :key="habit.id" :habit="habit" />
      </div>

      <!-- Empty State -->
      <div v-if="emptyHabits" class="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <UIcon name="i-heroicons-clipboard-document-list" class="h-12 w-12 text-white/20" />
        <div class="text-white/40">No habits yet. Create your first habit!</div>
      </div>
    </div>

    <!-- Create Habit Modal -->
    <UModal
      v-model="createHabitModal"
      :ui="{ container: 'items-center', width: 'w-96', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'bg-white/5 dark:bg-black/60' } }">
      <GuestHabitForm @habitAdded="createHabitModal = false" />
    </UModal>
  </Card>
</template>
