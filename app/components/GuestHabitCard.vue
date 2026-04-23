<script setup lang="ts">
import { marked } from 'marked';
import { format } from 'date-fns';

const props = defineProps<{ habit: any }>();

const { deleteHabit, editHabit, toggleTodayCompletion, isTodayCompleted, getCompletionRate } = useHabits();

const renderMarkdown = (text: string) => marked(text);

const openHabitModal = ref(false);

// Delete habit
const confirmDeleteHabit = ref(false);
const confirmationText = ref('');

const openDeleteConfirmation = () => {
  confirmDeleteHabit.value = true;
};

const closeDeleteConfirmation = () => {
  confirmationText.value = '';
  confirmDeleteHabit.value = false;
};

const handleDelete = () => {
  deleteHabit(props.habit.id);
  confirmDeleteHabit.value = false;
  openHabitModal.value = false;
};

// Edit habit
const editingHabit = ref(false);
const edit = ref({ title: '', description: '', habitView: false });

const startEdit = () => {
  editingHabit.value = true;
  edit.value = {
    title: props.habit.title,
    description: props.habit.description || '',
    habitView: props.habit.habitView,
  };
};

const saveEdit = () => {
  editHabit(props.habit.id, {
    title: edit.value.title,
    description: edit.value.description,
    habitView: edit.value.habitView,
  });
  editingHabit.value = false;
};

const cancelEdit = () => {
  editingHabit.value = false;
};

const handleToggle = () => {
  const wasCompleted = toggleTodayCompletion(props.habit);
  if (wasCompleted) {
    startConfettiAnimation();
  }
};
</script>

<template>
  <ContentBox class="mx-4 mb-4 flex cursor-pointer gap-3 bg-neutral-400/5 p-3 transition hover:bg-white/5 active:scale-[.975]" @click="openHabitModal = true">
    <div class="flex flex-1 flex-col justify-center gap-1">
      <div class="text-md line-clamp-1 font-medium text-white">{{ habit.title }}</div>
      <div class="line-clamp-3 text-xs text-white/70" v-html="renderMarkdown(habit.description || '')"></div>
    </div>
    <HabitHeatmap :habit="habit" :habitDays="49" />
  </ContentBox>

  <UModal
    v-model="openHabitModal"
    :ui="{ container: 'items-center', background: '', shadow: '', overlay: { base: 'backdrop-blur-2xl', background: 'bg-white/5 dark:bg-black/60' } }">
    <div class="flex flex-col gap-4">
      <ContentBox class="flex flex-col gap-2.5 bg-white/10 p-2.5 dark:bg-neutral-400/5">
        <div class="flex w-full items-center justify-between gap-2.5 px-0.5 text-white/25 dark:text-white/15">
          <div class="text-xs">
            Completion Rate:
            <strong>{{ getCompletionRate(habit) }}%</strong>
          </div>
          <UProgress
            :value="getCompletionRate(habit)"
            size="xs"
            :ui="{
              wrapper: 'flex-1',
              progress: {
                color: 'text-white/25 dark:text-white/15',
                track:
                  '[&::-webkit-progress-bar]:bg-white/10 [&::-webkit-progress-bar]:dark:bg-white/5 [@supports(selector(&::-moz-progress-bar))]:bg-white/10 [@supports(selector(&::-moz-progress-bar))]:dark:bg-white/5',
              },
            }" />
          <div class="text-xs">
            Today:
            <strong>{{ isTodayCompleted(habit) ? 'Completed' : 'Pending' }}</strong>
          </div>
        </div>
        <HabitHeatmap :habit="habit" :habitDays="343" />
      </ContentBox>

      <div class="flex flex-col gap-4 px-3 text-white">
        <div class="flex items-center justify-between gap-3">
          <UInput v-if="editingHabit" :ui="{ wrapper: 'flex-1', rounded: 'rounded-full', size: { sm: 'text-sm font-semibold' } }" v-model="edit.title" />
          <div v-else class="line-clamp-1 text-xl font-semibold">{{ habit.title }}</div>
          <div class="flex items-center gap-3">
            <button
              @click="handleToggle"
              class="button px-2.5 py-1.5 font-semibold outline-none"
              :class="isTodayCompleted(habit) ? 'bg-white/10 hover:bg-white/25' : 'bg-green-500 hover:bg-green-400 dark:bg-green-400 dark:text-green-950 dark:hover:bg-green-300'">
              <UIcon v-if="!isTodayCompleted(habit)" name="i-heroicons-check-16-solid" class="h-5 w-5" />
              {{ isTodayCompleted(habit) ? 'Undo' : 'Complete' }}
            </button>

            <UPopover :popper="{ placement: 'bottom-end' }" :ui="{ background: '', shadow: '', ring: '' }">
              <button class="button bg-white/10 p-1.5 hover:bg-white/25">
                <UIcon name="i-heroicons-ellipsis-horizontal-20-solid" class="h-5 w-5" />
              </button>
              <template #panel="{ close }">
                <div class="dropdown">
                  <div
                    @click="() => { close(); startEdit(); }"
                    class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30">
                    <UIcon name="i-heroicons-pencil-square-20-solid" class="h-5 w-5" />
                    <span>Edit</span>
                  </div>
                  <div class="border-b border-white/5"></div>
                  <div
                    @click="() => { close(); openDeleteConfirmation(); }"
                    class="m-1 flex cursor-pointer items-center gap-3 rounded-lg p-2 transition hover:bg-black/30 dark:text-red-500 dark:hover:bg-red-900/30">
                    <UIcon name="i-heroicons-trash-20-solid" class="h-5 w-5" />
                    <span>Delete</span>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>

        <ContentBox class="flex flex-col gap-2 bg-white/10 p-4 backdrop-blur-2xl dark:bg-neutral-200/5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 text-xs font-medium text-white/50">
              <p>{{ format(habit.createdAt, 'MMM d, yyyy') }}</p>
              <UIcon :name="habit.habitView ? 'i-heroicons-eye-20-solid' : 'i-heroicons-eye-slash-20-solid'" class="-mt-0.5 h-4 w-4" />
            </div>
          </div>
          <div class="max-h-[calc(100vh-23rem)] overflow-y-auto">
            <UTextarea v-if="editingHabit" v-model="edit.description" autoresize />
            <div v-else class="prose prose-sm prose-invert" v-html="renderMarkdown(habit.description || '')"></div>
          </div>
          <div v-if="editingHabit" class="mt-2 flex items-center justify-between">
            <div></div>
            <div class="flex items-center gap-4 text-sm">
              <div>
                Visibility:
                <strong>{{ edit.habitView ? 'Public' : 'Private' }}</strong>
              </div>
              <UToggle v-model="edit.habitView" />
            </div>
          </div>
        </ContentBox>

        <div v-if="editingHabit" class="flex items-center justify-between">
          <div></div>
          <div class="flex gap-2">
            <UButton :ui="{ rounded: 'rounded-full' }" @click="cancelEdit" color="white" variant="link">Cancel</UButton>
            <UButton :ui="{ rounded: 'rounded-full' }" @click="saveEdit" trailing>Save changes</UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model="confirmDeleteHabit" :ui="{ width: 'w-80', rounded: 'rounded-2xl' }">
      <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Are you sure?</h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="closeDeleteConfirmation" />
          </div>
        </template>
        <div class="flex flex-col gap-4">
          <p v-if="habit.completeDays.length > 1" class="text-sm text-red-500">
            Warning: This habit has been completed for {{ habit.completeDays.length }} days. Deleting it will remove all progress.
          </p>
          <p class="text-sm text-neutral-400">
            To confirm deletion, please type
            <strong>DELETE</strong>
            in the box below.
          </p>
          <UInput color="red" v-model="confirmationText" placeholder="Type DELETE here..." />
          <UButton block color="red" :disabled="confirmationText.toLowerCase() !== 'delete'" @click="handleDelete">I understand, delete this habit</UButton>
        </div>
      </UCard>
    </UModal>
  </UModal>
</template>
