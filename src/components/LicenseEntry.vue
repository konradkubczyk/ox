<script setup lang="ts">
import type { PropType } from 'vue'
import type { LicenseInterface } from '@/types/LicenseInterface'

defineProps({
  license: {
    type: Object as PropType<LicenseInterface>,
    required: true
  }
})
</script>

<template>
  <div  class="collapse collapse-arrow bg-base-200">
    <input type="radio" name="my-accordion-1" />
    <div class="collapse-title flex gap-3 items-center justify-between flex-wrap">
      <h2 class="md:text-xl">{{ license.name }}</h2>
      <span class="text-base-content/40">{{ license.licenses }}</span>
    </div>
    <div class="collapse-content flex flex-col gap-5">
      <ul>
        <li v-if="license.publisher">
          Publisher: {{ license.publisher }}
        </li>
        <li v-if="license.version">
          Version: {{ license.version }}
        </li>
        <li v-if="license.description">
          Description: {{ license.description }}
        </li>
        <li v-if="license.repository">
          Repository:
          <a :href="license.repository" class="underline hover:text-base-content/80 transition"
             target="_blank">{{ license.repository }}
          </a>
        </li>
        <li v-if="license.copyright">
          Copyright: {{ license.copyright }}
        </li>
      </ul>
      <pre
        v-if="license.licenseText"
        class="whitespace-pre-line p-4 bg-base-100 rounded-lg"
      >
            {{ license.licenseText }}
          </pre>
    </div>
  </div>
</template>
