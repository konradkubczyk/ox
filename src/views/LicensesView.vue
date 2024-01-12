<script setup lang="ts">
import licenses from '@/assets/licenses.json'

interface License {
  name: string,
  licenses: string,
  publisher?: string,
  version?: string,
  description?: string,
  repository?: string,
  copyright?: string,
  licenseText?: string
}

const licensesList: License[] = Object.values(licenses)
</script>

<template>
  <section class="container mx-auto max-w-5xl mt-4">
    <div class="text-center max-w-3xl mx-auto">
      <h1 class="text-5xl">
        Licenses
      </h1>
      <p class="my-10">
        This project uses various third-party libraries. You can find the list of them and their licenses below. Click
        on the name of the library to view more details.
      </p>
    </div>
    <div class="flex flex-col gap-3 mx-3">
      <div v-for="(license, index) in licensesList" :key="index" class="collapse collapse-arrow bg-base-200">
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
            class="text-wrap overflow-scroll whitespace-pre-line p-4 bg-base-100 rounded-lg"
          >
            {{ license.licenseText }}
          </pre>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
