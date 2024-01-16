<script setup lang="ts">
import NotificationToast from '@/components/NotificationToast.vue'
import { onMounted, type PropType, ref, watch } from 'vue'
import { OperationStatesEnum } from '@/types/OperationStatesEnum'
import type { OperationStatusInterface } from '@/types/OperationStatusInterface'
import type { ToastInterface } from '@/types/ToastInterface'

const modal = ref<HTMLDialogElement | null>(null)

onMounted(() => {
  watch(() => props.operationStatus, (status) => {
    if (status.state !== OperationStatesEnum.Idle && modal.value) {
      modal.value.showModal()
    }
  })
})

const inviteLinkField = ref<HTMLInputElement | null>(null)
const copiedInviteLink = ref(false)

const toast = ref<ToastInterface>({ type: 'info', text: '' })

function selectAndCopyText() {
  if (!inviteLinkField.value) {
    return
  }
  inviteLinkField.value.select()
  const link = inviteLinkField.value.value
  navigator.clipboard.writeText(link).then(() => {
    copiedInviteLink.value = true
    toast.value.text = 'Copied to clipboard'
    setTimeout(() => {
      toast.value.text = ''
    }, 3000)
  })
}

const props = defineProps({
  operationStatus: {
    type: Object as PropType<OperationStatusInterface>,
    required: true
  },
  inviteLink: {
    type: String,
    required: true
  }
})

defineEmits(['play'])
</script>

<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box flex gap-4 flex-col">
      <div class="flex gap-3">
        <span v-if="operationStatus.inProgress" class="loading loading-spinner loading-md"></span>
        <h3 class="font-bold text-lg">{{ operationStatus.title }}</h3>
      </div>
      <p>{{ operationStatus.message }}</p>
      <input
        ref="inviteLinkField"
        class="input input-bordered join-item w-full"
        :value="inviteLink"
        v-if="operationStatus.state === OperationStatesEnum.Created"
        @click="selectAndCopyText"
        readonly
      />
      <button
        v-if="operationStatus.state === OperationStatesEnum.Created"
        class="btn"
        :disabled="!copiedInviteLink"
        @click="$emit('play')"
      >
        {{ copiedInviteLink ? 'Play now' : 'Copy the link to continue' }}
      </button>
      <div
        v-if="operationStatus.state === OperationStatesEnum.Error"
        class="modal-action mt-0"
      >
        <form method="dialog" class="w-full">
          <button class="btn w-full">Close</button>
        </form>
      </div>
    </div>
    <NotificationToast :toast="toast" />
  </dialog>
</template>
